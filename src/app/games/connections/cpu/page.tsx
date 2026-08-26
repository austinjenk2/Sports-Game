"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Player } from "@/data/players";
import { Link as GameLink, formatLink, pickComputerMove, sharedLinks } from "@/lib/connections";
import PlayerPicker from "@/components/PlayerPicker";

const BEST_KEY = "connections:vsComputer:personalBest";

interface ChainEntry {
  player: Player;
  by: "you" | "computer" | "start";
  link?: GameLink;
}

type Status = "picking-start" | "your-turn" | "computer-thinking" | "game-over";

export default function VsComputerPage() {
  const [chain, setChain] = useState<ChainEntry[]>([]);
  const [status, setStatus] = useState<Status>("picking-start");
  const [message, setMessage] = useState<string>("Name the first player to start the chain.");
  const [best, setBest] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const stored = Number(localStorage.getItem(BEST_KEY) ?? "0");
    return Number.isNaN(stored) ? 0 : stored;
  });

  const usedIds = new Set(chain.map((c) => c.player.id));
  const score = chain.length;

  function endGame(finalMessage: string) {
    setStatus("game-over");
    setMessage(finalMessage);
    if (score > best) {
      setBest(score);
      localStorage.setItem(BEST_KEY, String(score));
    }
  }

  function startChain(player: Player) {
    setChain([{ player, by: "start" }]);
    setStatus("computer-thinking");
    setMessage(`You started with ${player.name}. Computer is thinking...`);
  }

  function handleYourPick(player: Player) {
    const last = chain[chain.length - 1].player;
    const links = sharedLinks(last, player);
    if (links.length === 0) {
      endGame(`No connection between ${last.name} and ${player.name}. Game over!`);
      return;
    }
    const link = links[0];
    const nextChain = [...chain, { player, by: "you" as const, link }];
    setChain(nextChain);
    setStatus("computer-thinking");
    setMessage(`You linked via ${formatLink(link)}. Computer is thinking...`);
  }

  useEffect(() => {
    if (status !== "computer-thinking" || chain.length === 0) return;
    const last = chain[chain.length - 1].player;
    const timer = setTimeout(() => {
      const move = pickComputerMove(last, usedIds);
      if (!move) {
        endGame(`Computer couldn't find another connection from ${last.name}. You win this round!`);
        return;
      }
      const link = sharedLinks(last, move)[0];
      setChain((c) => [...c, { player: move, by: "computer", link }]);
      setStatus("your-turn");
      setMessage(`Computer said ${move.name} (${formatLink(link)}). Your turn.`);
    }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, chain]);

  function reset() {
    setChain([]);
    setStatus("picking-start");
    setMessage("Name the first player to start the chain.");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div>
        <Link href="/games/connections" className="text-sm text-white/50 hover:text-white">
          ← Back
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Vs. Computer</h1>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
        <span>
          Current streak: <strong>{score}</strong>
        </span>
        <span>
          Personal best: <strong className="text-emerald-400">{best}</strong>
        </span>
      </div>

      <p className="min-h-6 text-white/70">{message}</p>

      {status !== "game-over" && (
        <PlayerPicker
          onPick={status === "picking-start" ? startChain : handleYourPick}
          disabled={status === "computer-thinking"}
          excludeIds={usedIds}
          placeholder={
            status === "picking-start" ? "Search a player to start..." : "Search your next player..."
          }
        />
      )}

      {status === "game-over" && (
        <button
          onClick={reset}
          className="rounded-lg bg-emerald-500 px-4 py-3 font-medium text-black hover:bg-emerald-400"
        >
          Play again
        </button>
      )}

      <ol className="flex flex-col gap-2">
        {[...chain].reverse().map((entry, idx) => (
          <li
            key={`${entry.player.id}-${chain.length - idx}`}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2"
          >
            <span>
              {chain.length - idx}. {entry.player.name}
            </span>
            {entry.link && (
              <span className="text-xs text-white/50">{formatLink(entry.link)}</span>
            )}
            <span className="text-xs uppercase tracking-wide text-white/30">
              {entry.by === "you" ? "You" : entry.by === "computer" ? "CPU" : "Start"}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
