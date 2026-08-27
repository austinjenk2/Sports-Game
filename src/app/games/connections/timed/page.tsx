"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Player, PlayerPool } from "@/lib/players-db";
import {
  Link as GameLink,
  formatLink,
  isValidGuess,
  pickComputerLink,
} from "@/lib/connections";
import PlayerPicker from "@/components/PlayerPicker";

const BEST_KEY = "connections:soloTimed:personalBest";
const TURN_SECONDS = 30;

interface ChainEntry {
  player: Player;
  /** The attribute the computer announced that led to this player being named (null for the starting player). */
  link: GameLink | null;
}

type Status = "picking-start" | "computer-thinking" | "awaiting-guess" | "game-over";

const linkBadgeClass: Record<GameLink["type"], string> = {
  college: "bg-sky-tint text-sky",
  team: "bg-crimson-tint text-[#f3b3ab]",
  number: "bg-navy-tint text-cream",
};

export default function SoloTimedPage() {
  return (
    <Suspense>
      <SoloTimedGame />
    </Suspense>
  );
}

function SoloTimedGame() {
  const pool: PlayerPool = useSearchParams().get("pool") === "current" ? "current" : "all-time";
  const [chain, setChain] = useState<ChainEntry[]>([]);
  const [pendingLink, setPendingLink] = useState<GameLink | null>(null);
  const [status, setStatus] = useState<Status>("picking-start");
  const [message, setMessage] = useState<string>("Name the first player to start the chain.");
  const [lastOutcome, setLastOutcome] = useState<"win" | "lose" | null>(null);
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);
  const [best, setBest] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const stored = Number(localStorage.getItem(BEST_KEY) ?? "0");
    return Number.isNaN(stored) ? 0 : stored;
  });

  const usedIds = new Set(chain.map((c) => c.player.id));
  const score = chain.length;
  const isMyTurn = status === "picking-start" || status === "awaiting-guess";

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
    let cancelled = false;
    const timer = setTimeout(async () => {
      const link = await pickComputerLink(last.player, usedIds, pool, last.link?.type);
      if (cancelled) return;
      if (!link) {
        endGame(`Computer couldn't find another connection from ${last.player.name}. You win this round!`, "win");
        return;
      }
      setPendingLink(link);
      setStatus("awaiting-guess");
      setMessage(`Computer says: ${last.player.name} ${formatLink(link)}. Name a player who also ${formatLink(link)}.`);
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, chain, pool]);

  // Reset and run the 30-second clock for every turn it's the human's move.
  useEffect(() => {
    if (!isMyTurn) return;
    let cancelled = false;
    const resetTimer = setTimeout(() => {
      if (!cancelled) setTimeLeft(TURN_SECONDS);
    }, 0);
    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => {
      cancelled = true;
      clearTimeout(resetTimer);
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pendingLink]);

  // Time ran out on the current pick — automatic wrong answer.
  useEffect(() => {
    if (timeLeft > 0 || !isMyTurn) return;
    const timer = setTimeout(() => {
      if (status === "awaiting-guess" && pendingLink) {
        endGame(`Time's up! You didn't answer in time: ${formatLink(pendingLink)}. Game over!`, "lose");
      } else {
        endGame("Time's up! You didn't name a starting player in time.", "lose");
      }
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function reset() {
    setChain([]);
    setPendingLink(null);
    setStatus("picking-start");
    setLastOutcome(null);
    setMessage("Name the first player to start the chain.");
  }

  const clockLow = isMyTurn && timeLeft <= 10;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 pt-10 pb-6">
        <div className="mx-auto max-w-2xl">
          <Link href="/games/connections" className="font-eyebrow text-sm text-cream-dim hover:text-cream">
            ← Back
          </Link>
          <p className="mt-3 font-eyebrow text-sm font-semibold tracking-[0.2em] text-sky uppercase">
            Sports Game Hub &middot; The Sports Game &middot; {pool === "current" ? "Current Players" : "All-Time"}
          </p>
          <h1 className="font-display text-5xl text-cream uppercase">Solo Timed</h1>
          <p className="mt-3 max-w-xl font-body text-lg text-cream-dim">
            Same as Solo Endless, but every pick is on the clock. You&apos;ve got 30 seconds to name
            a player — run out of time and it counts as a wrong answer.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-6 pb-14">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-sky/25 bg-navy px-4 py-3.5">
            <span className="font-eyebrow text-[12.5px] font-semibold tracking-[0.14em] text-cream-faint uppercase">
              Streak
            </span>
            <div className="font-display text-[42px] leading-tight text-cream tabular-nums">
              {score}
            </div>
          </div>
          <div className="rounded-xl border border-sky/25 bg-navy px-4 py-3.5">
            <span className="font-eyebrow text-[12.5px] font-semibold tracking-[0.14em] text-cream-faint uppercase">
              Best
            </span>
            <div className="font-display text-[42px] leading-tight text-sky tabular-nums">
              {best}
            </div>
          </div>
          <div className="rounded-xl border border-sky/25 bg-navy px-4 py-3.5">
            <span className="font-eyebrow text-[12.5px] font-semibold tracking-[0.14em] text-cream-faint uppercase">
              Time Left
            </span>
            <div
              className={`font-display text-[42px] leading-tight tabular-nums ${
                clockLow ? "text-[#f3877a]" : "text-cream"
              }`}
            >
              {isMyTurn ? timeLeft : "—"}
            </div>
          </div>
        </div>

        <div className="foil-border flex flex-col gap-3.5 bg-navy p-5">
          {isMyTurn && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-tint">
              <div
                className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
                  clockLow ? "bg-[#f3877a]" : "bg-sky"
                }`}
                style={{ width: `${(timeLeft / TURN_SECONDS) * 100}%` }}
              />
            </div>
          )}

          <p
            className={`min-h-6 font-body text-[17px] leading-relaxed ${
              status === "game-over" && lastOutcome === "win"
                ? "font-eyebrow text-lg font-bold text-emerald-400"
                : status === "game-over" && lastOutcome === "lose"
                  ? "font-eyebrow text-lg font-bold text-[#f3877a]"
                  : "text-cream"
            }`}
          >
            {message}
          </p>

          {isMyTurn && (
            <PlayerPicker
              onPick={status === "picking-start" ? startChain : handleGuess}
              excludeIds={usedIds}
              pool={pool}
              placeholder={
                status === "picking-start" ? "Search a player to start..." : "Search a matching player..."
              }
            />
          )}

          {status === "game-over" && (
            <button
              onClick={reset}
              className="rounded-lg bg-sky px-4 py-3 font-eyebrow text-[15px] font-bold tracking-[0.08em] text-navy-deep uppercase hover:bg-sky-deep hover:text-cream"
            >
              Play again
            </button>
          )}
        </div>

        {chain.length > 0 && (
          <div>
            <div className="mt-2 mb-2 font-eyebrow text-[13px] font-semibold tracking-[0.16em] text-cream-faint uppercase">
              The Chain
            </div>
            <ol className="flex flex-col gap-2">
              {[...chain].reverse().map((entry, idx) => (
                <li
                  key={`${entry.player.id}-${chain.length - idx}`}
                  className="flex items-center gap-3.5 rounded-lg border border-sky/15 bg-navy px-3.5 py-3"
                >
                  <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-sky font-eyebrow text-[13px] font-bold text-navy-deep tabular-nums">
                    {chain.length - idx}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="font-display text-[16.5px] text-cream">{entry.player.name}</span>
                    {entry.link && (
                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-0.5 font-eyebrow text-[11.5px] font-semibold tracking-wide uppercase ${linkBadgeClass[entry.link.type]}`}
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
