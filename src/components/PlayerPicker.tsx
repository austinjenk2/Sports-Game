"use client";

import { useEffect, useState } from "react";
import { Player, PlayerPool, searchPlayersByName } from "@/lib/players-db";

function playerYears(p: Player): string | null {
  if (!p.first_season) return null;
  const last = p.last_season ?? p.first_season;
  return p.first_season === last ? String(p.first_season) : `${p.first_season}–${last}`;
}

interface PlayerPickerProps {
  onPick: (player: Player) => void;
  placeholder?: string;
  disabled?: boolean;
  excludeIds?: Set<string>;
  pool: PlayerPool;
}

export default function PlayerPicker({
  onPick,
  placeholder = "Search a player...",
  disabled,
  excludeIds,
  pool,
}: PlayerPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const matches = await searchPlayersByName(q, pool, 16);
      if (cancelled) return;
      const filtered = excludeIds ? matches.filter((p) => !excludeIds.has(p.id)) : matches;
      setResults(filtered.slice(0, 8));
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, excludeIds, pool]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        disabled={disabled}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-sky/40 bg-navy-tint/40 px-4 py-3 font-eyebrow text-base font-medium text-cream outline-none placeholder:font-body placeholder:text-cream-faint focus:border-sky disabled:opacity-50"
      />
      {query.trim().length > 0 && results.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full divide-y divide-hairline overflow-hidden rounded-lg border border-sky/30 bg-navy shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-3 px-4 py-2.5 text-left font-body text-[15.5px] text-cream hover:bg-sky-tint"
                onClick={() => {
                  onPick(p);
                  setQuery("");
                }}
              >
                <span>{p.name}</span>
                {playerYears(p) && (
                  <span className="flex-none font-eyebrow text-[12.5px] text-cream-faint tabular-nums">
                    {playerYears(p)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.trim().length > 0 && results.length === 0 && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-sky/30 bg-navy px-4 py-3 font-body text-sm text-cream-faint italic shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
          No matching player in the database.
        </div>
      )}
    </div>
  );
}
