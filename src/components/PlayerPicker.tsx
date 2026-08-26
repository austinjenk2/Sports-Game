"use client";

import { useMemo, useState } from "react";
import { Player, findPlayersByName } from "@/data/players";

interface PlayerPickerProps {
  onPick: (player: Player) => void;
  placeholder?: string;
  disabled?: boolean;
  excludeIds?: Set<string>;
}

export default function PlayerPicker({
  onPick,
  placeholder = "Search a player...",
  disabled,
  excludeIds,
}: PlayerPickerProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const matches = findPlayersByName(query);
    const filtered = excludeIds ? matches.filter((p) => !excludeIds.has(p.id)) : matches;
    return filtered.slice(0, 8);
  }, [query, excludeIds]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        disabled={disabled}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-base outline-none placeholder:text-white/40 focus:border-emerald-400 disabled:opacity-50"
      />
      {query.trim().length > 0 && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-white/15 bg-neutral-900 shadow-xl">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="block w-full px-4 py-2 text-left hover:bg-emerald-500/20"
                onClick={() => {
                  onPick(p);
                  setQuery("");
                }}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.trim().length > 0 && results.length === 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-white/15 bg-neutral-900 px-4 py-2 text-sm text-white/50 shadow-xl">
          No matching player in the database.
        </div>
      )}
    </div>
  );
}
