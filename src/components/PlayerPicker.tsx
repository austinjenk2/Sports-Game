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
        className="w-full border-2 border-ink bg-paper-2 px-4 py-3 font-eyebrow text-base font-medium text-ink outline-none placeholder:font-body placeholder:text-ink-faint placeholder:italic focus:border-navy focus:shadow-[3px_3px_0_var(--navy)] disabled:opacity-50"
      />
      {query.trim().length > 0 && results.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full divide-y divide-hairline overflow-hidden border-2 border-ink bg-paper-2 shadow-[5px_5px_0_var(--navy)]">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="block w-full px-4 py-2.5 text-left font-body text-[15.5px] hover:bg-navy-tint"
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
        <div className="absolute z-10 mt-2 w-full border-2 border-ink bg-paper-2 px-4 py-3 font-body text-sm text-ink-faint italic shadow-[5px_5px_0_var(--navy)]">
          No matching player in the database.
        </div>
      )}
    </div>
  );
}
