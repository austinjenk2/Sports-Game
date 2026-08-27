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

const linkBadgeClass: Record<GameLink["type"], string> = {
  college: "bg-navy text-white",
  team: "bg-red text-white",
  number: "bg-gold text-[#201400]",
};

export default function SoloEndlessPage() {
  const [chain, setChain] = useState<ChainEntry[]>([]);
  const [pendingLink, setPendingLink] = useState<GameLink | null>(null);
  const [status, setStatus] = useState<Status>("picking-start");
  const [message, setMessage] = useState<string>("Name the first player to start the chain.");
  const [lastOutcome, setLastOutcome] = useState<"win" | "lose" | null>(null);
  const [best, setBest] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const stored = Number(localStorage.getItem(BEST_KEY) ?? "0");
    return Number.isNaN(stored) ? 0 : stored;
  });

  const usedIds = new Set(chain.map((c) => c.player.id));
  const score = chain.length;

  function endGame(finalMessage: string, outcome: "win" | "lose") {
    setStatus("game-over");
    setLastOutcome(outcome);
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
      endGame(`${player.name} doesn't match: ${formatLink(pendingLink)}. Game over!`, "lose");
      return;
    }
    setChain((c) => [...c, { player, link: pendingLink }]);
    setPendingLink(null);
    setStatus("computer-thinking");
    setMessage(`You said ${player.name}. Computer is thinking...`);
  }

  useEffect(() => {
    if (status !== "computer-thinking" || chain.length === 0) return;
    const last = chain[chain.length - 1];
    const timer = setTimeout(() => {
      const link = pickComputerLink(last.player, usedIds, last.link?.type);
      if (!link) {
        endGame(`Computer couldn't find another connection from ${last.player.name}. You win this round!`, "win");
        return;
      }
      setPendingLink(link);
      setStatus("awaiting-guess");
      setMessage(`Computer says: ${last.player.name} ${formatLink(link)}. Name a player who also ${formatLink(link)}.`);
    }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, chain]);

  function reset() {
    setChain([]);
    setPendingLink(null);
    setStatus("picking-start");
    setLastOutcome(null);
    setMessage("Name the first player to start the chain.");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-4 border-gold bg-gradient-to-br from-navy to-navy-deep px-6 py-8 text-white">
        <div className="mx-auto max-w-2xl">
          <Link href="/games/connections" className="font-eyebrow text-sm text-[#cfd6e4] hover:text-white">
            ← Back
          </Link>
          <p className="mt-3 font-eyebrow text-sm font-semibold tracking-[0.2em] text-gold uppercase">
            Sports Game Hub &middot; The Sports Game
          </p>
          <h1 className="font-display text-5xl font-black italic">Solo Endless</h1>
          <p className="mt-3 max-w-xl font-eyebrow text-lg text-[#cfd6e4]">
            Name a player. The computer states one true fact about them — a college, a team, or a
            jersey number. You name a different player who matches it. Keep the chain alive as long
            as you can.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-6 py-8">
        <div className="grid grid-cols-2 gap-3.5">
          <div className="relative border-2 border-ink bg-paper-2 px-4 py-3.5">
            <span className="absolute top-[-2px] left-[-2px] right-[-2px] h-[5px] bg-red" />
            <span className="font-eyebrow text-[12.5px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
              Current Streak
            </span>
            <div className="font-display text-[42px] leading-tight font-black italic text-red tabular-nums">
              {score}
            </div>
          </div>
          <div className="relative border-2 border-ink bg-paper-2 px-4 py-3.5">
            <span className="absolute top-[-2px] left-[-2px] right-[-2px] h-[5px] bg-gold" />
            <span className="font-eyebrow text-[12.5px] font-semibold tracking-[0.14em] text-ink-faint uppercase">
              Personal Best
            </span>
            <div className="font-display text-[42px] leading-tight font-black italic text-gold tabular-nums">
              {best}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 border-2 border-ink bg-paper-2 p-5">
          <p
            className={`min-h-6 font-body text-[17px] leading-relaxed ${
              status === "game-over" && lastOutcome === "win"
                ? "font-eyebrow text-lg font-bold text-green-700"
                : status === "game-over" && lastOutcome === "lose"
                  ? "font-eyebrow text-lg font-bold text-red"
                  : "text-ink"
            }`}
          >
            {message}
          </p>

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
              className="border-2 border-ink bg-navy px-4 py-3 font-eyebrow text-[15px] font-bold tracking-[0.08em] text-white uppercase hover:bg-navy-deep"
            >
              Play again
            </button>
          )}
        </div>

        {chain.length > 0 && (
          <div>
            <div className="mt-2 mb-2 border-t-[3px] border-double border-ink pt-3.5 font-eyebrow text-[13px] font-semibold tracking-[0.16em] text-ink-faint uppercase">
              The Chain
            </div>
            <ol className="flex flex-col divide-y divide-hairline border-t border-hairline">
              {[...chain].reverse().map((entry, idx) => (
                <li
                  key={`${entry.player.id}-${chain.length - idx}`}
                  className="flex items-center gap-3.5 py-3"
                >
                  <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-ink font-eyebrow text-[13px] font-bold text-paper tabular-nums">
                    {chain.length - idx}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-display text-[16.5px] font-bold">{entry.player.name}</span>
                    {entry.link && (
                      <span
                        className={`inline-flex w-fit rounded-[3px] px-2 py-0.5 font-eyebrow text-[11.5px] font-semibold tracking-wide uppercase ${linkBadgeClass[entry.link.type]}`}
                      >
                        {formatLink(entry.link)}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </main>
    </div>
  );
}
