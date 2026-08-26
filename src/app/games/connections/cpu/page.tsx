"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Player } from "@/data/players";
import {
  Link as GameLink,
  formatLink,
  isValidGuess,
  pickComputerLink,
} from "@/lib/connections";
import PlayerPicker from "@/components/PlayerPicker";

const BEST_KEY = "connections:soloEndless:personalBest";

interface ChainEntry {
  player: Player;
  /** The attribute the computer announced that led to this player being named (null for the starting player). */
  link: GameLink | null;
}

type Status = "picking-start" | "computer-thinking" | "awaiting-guess" | "game-over";

export default function SoloEndlessPage() {
  const [chain, setChain] = useState<ChainEntry[]>([]);
  const [pendingLink, setPendingLink] = useState<GameLink | null>(null);
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
    setPendingLink(null);
    if (score > best) {
      setBest(score);
      localStorage.setItem(BEST_KEY, String(score));
    }
  }

  function startChain(player: Player) {
    setChain([{ player, link: null }]);
    setStatus("computer-thinking");
    setMessage(`You started with ${player.name}. Computer is thinking...`);
  }

  function handleGuess(player: Player) {
    if (!pendingLink) return;
    if (!isValidGuess(pendingLink, player, usedIds)) {
      endGame(
        `${player.name} doesn't match: ${formatLink(pendingLink)}. Game over!`
      );
      return;
    }
    setChain((c) => [...c, { player, link: pendingLink }]);
    setPendingLink(null);
    setStatus("computer-thinking");
    setMessage(`You said ${player.name}. Computer is thinking...`);
  }

  useEffect(() => {
    if (status !== "computer-thinking" || chain.length === 0) return;
    const last = chain[chain.length - 1].player;
    const timer = setTimeout(() => {
      const link = pickComputerLink(last, usedIds);
      if (!link) {
        endGame(`Computer couldn't find another connection from ${last.name}. You win this round!`);
        return;
      }
      setPendingLink(link);
      setStatus("awaiting-guess");
      setMessage(`Computer says: ${last.name} ${formatLink(link)}. Name a player who also ${formatLink(link)}.`);
    }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, chain]);

  function reset() {
    setChain([]);
    setPendingLink(null);
    setStatus("picking-start");
    setMessage("Name the first player to start the chain.");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div>
        <Link href="/games/connections" className="text-sm text-white/50 hover:text-white">
          ← Back
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Solo Endless</h1>
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

      {(status === "picking-start" || status === "awaiting-guess") && (
        <PlayerPicker
          onPick={status === "picking-start" ? startChain : handleGuess}
          excludeIds={usedIds}
          placeholder={
            status === "picking-start" ? "Search a player to start..." : "Search a matching player..."
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
            {entry.link && <span className="text-xs text-white/50">{formatLink(entry.link)}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
