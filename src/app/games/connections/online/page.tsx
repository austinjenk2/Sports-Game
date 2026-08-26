"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getPlayerById, Player } from "@/data/players";
import { formatLink, sharedLinks } from "@/lib/connections";
import { generateRoomCode } from "@/lib/room-code";
import { isOnlineModeConfigured, supabase } from "@/lib/supabase";
import PlayerPicker from "@/components/PlayerPicker";

type Role = "host" | "guest";

interface RoomRow {
  code: string;
  status: "waiting" | "active" | "finished";
  host_name: string;
  guest_name: string | null;
  current_turn: Role;
  loser: Role | null;
}

interface MoveRow {
  id: number;
  room_code: string;
  seq: number;
  by: Role;
  player_id: string;
  player_name: string;
  link_type: string | null;
  link_value: string | null;
}

export default function OnlinePage() {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [room, setRoom] = useState<RoomRow | null>(null);
  const [moves, setMoves] = useState<MoveRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const usedIds = useMemo(() => new Set(moves.map((m) => m.player_id)), [moves]);
  const lastPlayer: Player | null = moves.length
    ? getPlayerById(moves[moves.length - 1].player_id) ?? null
    : null;

  // Subscribe to room + move updates once we have a room code.
  useEffect(() => {
    if (!supabase || !room?.code) return;
    const code = room.code;
    let cancelled = false;
    void (async () => {
      const { data } = await supabase!
        .from("moves")
        .select("*")
        .eq("room_code", code)
        .order("seq", { ascending: true });
      if (!cancelled) setMoves((data as MoveRow[]) ?? []);
    })();

    const channel = supabase
      .channel(`room-${code}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `code=eq.${code}` },
        (payload) => {
          if (payload.eventType === "DELETE") return;
          setRoom(payload.new as RoomRow);
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "moves", filter: `room_code=eq.${code}` },
        (payload) => {
          setMoves((prev) => {
            const next = payload.new as MoveRow;
            if (prev.some((m) => m.id === next.id)) return prev;
            return [...prev, next].sort((a, b) => a.seq - b.seq);
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase?.removeChannel(channel);
    };
  }, [room?.code]);

  async function createRoom() {
    if (!supabase || !name.trim()) return;
    const code = generateRoomCode();
    const { data, error: err } = await supabase
      .from("rooms")
      .insert({ code, host_name: name.trim() })
      .select()
      .single();
    if (err || !data) {
      setError(err?.message ?? "Could not create room.");
      return;
    }
    setRole("host");
    setRoom(data as RoomRow);
  }

  async function joinRoom() {
    if (!supabase || !name.trim() || !joinCode.trim()) return;
    const code = joinCode.trim().toUpperCase();
    const { data, error: err } = await supabase
      .from("rooms")
      .update({ guest_name: name.trim(), status: "active" })
      .eq("code", code)
      .is("guest_name", null)
      .select()
      .single();
    if (err || !data) {
      setError("Room not found, already full, or already started.");
      return;
    }
    setRole("guest");
    setRoom(data as RoomRow);
  }

  async function submitMove(player: Player) {
    if (!supabase || !room || !role) return;
    setError(null);

    if (lastPlayer) {
      const links = sharedLinks(lastPlayer, player);
      if (links.length === 0) {
        await supabase
          .from("rooms")
          .update({ status: "finished", loser: role })
          .eq("code", room.code);
        return;
      }
      const link = links[0];
      const { error: err } = await supabase.from("moves").insert({
        room_code: room.code,
        seq: moves.length,
        by: role,
        player_id: player.id,
        player_name: player.name,
        link_type: link.type,
        link_value: link.value,
      });
      if (err) {
        setError(err.message);
        return;
      }
    } else {
      const { error: err } = await supabase.from("moves").insert({
        room_code: room.code,
        seq: 0,
        by: role,
        player_id: player.id,
        player_name: player.name,
      });
      if (err) {
        setError(err.message);
        return;
      }
    }

    await supabase
      .from("rooms")
      .update({ current_turn: role === "host" ? "guest" : "host" })
      .eq("code", room.code);
  }

  if (!isOnlineModeConfigured) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-white/70">
          Online mode isn&apos;t configured. Set NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY to enable it.
        </p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-16">
        <div>
          <Link href="/games/connections" className="text-sm text-white/50 hover:text-white">
            ← Back
          </Link>
          <h1 className="mt-3 text-3xl font-bold">1v1 Online</h1>
        </div>
        <input
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-3"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={createRoom}
          disabled={!name.trim()}
          className="rounded-lg bg-emerald-500 px-4 py-3 font-medium text-black hover:bg-emerald-400 disabled:opacity-40"
        >
          Create a room
        </button>
        <div className="flex items-center gap-2 text-white/40">
          <div className="h-px flex-1 bg-white/10" />
          or
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <input
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 uppercase tracking-widest"
          placeholder="Room code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button
          onClick={joinRoom}
          disabled={!name.trim() || !joinCode.trim()}
          className="rounded-lg border border-white/20 px-4 py-3 font-medium hover:bg-white/10 disabled:opacity-40"
        >
          Join a room
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  const isMyTurn = room.status === "active" && room.current_turn === role;
  const waitingForGuest = room.status === "waiting";

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div>
        <Link href="/games/connections" className="text-sm text-white/50 hover:text-white">
          ← Back
        </Link>
        <h1 className="mt-3 text-3xl font-bold">1v1 Online</h1>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
        <p>
          Room code: <strong className="tracking-widest">{room.code}</strong> — share this with
          your friend.
        </p>
        <p className="mt-1 text-white/60">
          {room.host_name} (host) vs. {room.guest_name ?? "waiting for player..."}
        </p>
      </div>

      {waitingForGuest && <p className="text-white/70">Waiting for a second player to join...</p>}

      {room.status === "finished" && (
        <p className="text-lg font-medium text-red-400">
          {room.loser === role
            ? `You couldn't continue the chain. You lose!`
            : `Your opponent couldn't continue the chain. You win!`}
        </p>
      )}

      {room.status === "active" && (
        <>
          <p className="text-white/70">
            {isMyTurn
              ? lastPlayer
                ? `Your turn — link to ${lastPlayer.name}.`
                : "Your turn — name the first player."
              : "Waiting for opponent's move..."}
          </p>
          {isMyTurn && (
            <PlayerPicker
              onPick={submitMove}
              excludeIds={usedIds}
              placeholder={lastPlayer ? "Search your next player..." : "Search a player to start..."}
            />
          )}
        </>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <ol className="flex flex-col gap-2">
        {[...moves].reverse().map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2"
          >
            <span>
              {m.seq + 1}. {m.player_name}
            </span>
            {m.link_type && m.link_value && (
              <span className="text-xs text-white/50">
                {formatLink({ type: m.link_type as "college" | "team" | "number", value: m.link_value })}
              </span>
            )}
            <span className="text-xs uppercase tracking-wide text-white/30">
              {m.by === role ? "You" : "Opponent"}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
