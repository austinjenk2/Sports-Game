"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getPlayerById, Player } from "@/lib/players-db";
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
  const [fetchedLastPlayer, setFetchedLastPlayer] = useState<Player | null>(null);
  const lastMoveId = moves.length ? moves[moves.length - 1].player_id : null;
  const lastPlayer =
    lastMoveId && fetchedLastPlayer?.id === lastMoveId ? fetchedLastPlayer : null;

  useEffect(() => {
    if (!lastMoveId) return;
    let cancelled = false;
    void (async () => {
      const player = await getPlayerById(lastMoveId);
      if (!cancelled) setFetchedLastPlayer(player);
    })();
    return () => {
      cancelled = true;
    };
  }, [lastMoveId]);

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

  const linkBadgeClass: Record<string, string> = {
    college: "bg-navy text-white",
    team: "bg-red text-white",
    number: "bg-gold text-[#201400]",
  };

  const header = (
    <header className="border-b-4 border-gold bg-gradient-to-br from-navy to-navy-deep px-6 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/games/connections" className="font-eyebrow text-sm text-[#cfd6e4] hover:text-white">
          ← Back
        </Link>
        <p className="mt-3 font-eyebrow text-sm font-semibold tracking-[0.2em] text-gold uppercase">
          Sports Game Hub &middot; The Sports Game
        </p>
        <h1 className="font-display text-5xl font-black italic">1v1 Online</h1>
      </div>
    </header>
  );

  if (!isOnlineModeConfigured) {
    return (
      <div className="flex min-h-screen flex-col">
        {header}
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
          <p className="font-body text-ink-dim">
            Online mode isn&apos;t configured. Set NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY to enable it.
          </p>
        </main>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col">
        {header}
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-6 py-8">
          <div className="flex flex-col gap-3.5 border-2 border-ink bg-paper-2 p-5">
            <input
              className="border-2 border-ink bg-paper-2 px-4 py-3 font-eyebrow text-base font-medium text-ink outline-none focus:border-navy focus:shadow-[3px_3px_0_var(--navy)]"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={createRoom}
              disabled={!name.trim()}
              className="border-2 border-ink bg-navy px-4 py-3 font-eyebrow text-[15px] font-bold tracking-[0.08em] text-white uppercase hover:bg-navy-deep disabled:opacity-40"
            >
              Create a room
            </button>
            <div className="flex items-center gap-2 font-eyebrow text-sm text-ink-faint uppercase">
              <div className="h-px flex-1 bg-hairline" />
              or
              <div className="h-px flex-1 bg-hairline" />
            </div>
            <input
              className="border-2 border-ink bg-paper-2 px-4 py-3 font-eyebrow text-base font-medium tracking-widest text-ink uppercase outline-none focus:border-navy focus:shadow-[3px_3px_0_var(--navy)]"
              placeholder="Room code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <button
              onClick={joinRoom}
              disabled={!name.trim() || !joinCode.trim()}
              className="border-2 border-ink bg-paper-2 px-4 py-3 font-eyebrow text-[15px] font-bold tracking-[0.08em] text-navy uppercase hover:bg-navy-tint disabled:opacity-40"
            >
              Join a room
            </button>
            {error && <p className="font-body text-sm text-red">{error}</p>}
          </div>
        </main>
      </div>
    );
  }

  const isMyTurn = room.status === "active" && room.current_turn === role;
  const waitingForGuest = room.status === "waiting";

  return (
    <div className="flex min-h-screen flex-col">
      {header}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-6 py-8">
        <div className="relative border-2 border-ink bg-paper-2 px-4 py-3.5">
          <span className="absolute top-[-2px] left-[-2px] right-[-2px] h-[5px] bg-gold" />
          <p className="font-body text-ink">
            Room code: <strong className="font-eyebrow tracking-widest">{room.code}</strong> —
            share this with your friend.
          </p>
          <p className="mt-1 font-eyebrow text-sm text-ink-dim">
            {room.host_name} (host) vs. {room.guest_name ?? "waiting for player..."}
          </p>
        </div>

        {waitingForGuest && (
          <p className="font-body text-ink-dim italic">Waiting for a second player to join...</p>
        )}

        {room.status === "finished" && (
          <p className="font-eyebrow text-lg font-bold text-red">
            {room.loser === role
              ? `You couldn't continue the chain. You lose!`
              : `Your opponent couldn't continue the chain. You win!`}
          </p>
        )}

        {room.status === "active" && (
          <div className="flex flex-col gap-3.5 border-2 border-ink bg-paper-2 p-5">
            <p className="font-body text-[17px] text-ink">
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
          </div>
        )}

        {error && <p className="font-body text-sm text-red">{error}</p>}

        {moves.length > 0 && (
          <ol className="flex flex-col divide-y divide-hairline border-t border-hairline">
            {[...moves].reverse().map((m) => (
              <li key={m.id} className="flex items-center gap-3.5 py-3">
                <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-ink font-eyebrow text-[13px] font-bold text-paper tabular-nums">
                  {m.seq + 1}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="font-display text-[16.5px] font-bold">{m.player_name}</span>
                  {m.link_type && m.link_value && (
                    <span
                      className={`inline-flex w-fit rounded-[3px] px-2 py-0.5 font-eyebrow text-[11.5px] font-semibold tracking-wide uppercase ${linkBadgeClass[m.link_type]}`}
                    >
                      {formatLink({ type: m.link_type as "college" | "team" | "number", value: m.link_value })}
                    </span>
                  )}
                </span>
                <span className="font-eyebrow text-xs tracking-wide text-ink-faint uppercase">
                  {m.by === role ? "You" : "Opponent"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
