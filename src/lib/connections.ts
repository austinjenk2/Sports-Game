import { Player, players } from "@/data/players";

export type LinkType = "college" | "team" | "number";

export interface Link {
  type: LinkType;
  value: string;
}

/** All shared attributes (college/team/number) between two players. */
export function sharedLinks(a: Player, b: Player): Link[] {
  const links: Link[] = [];
  for (const college of a.colleges) {
    if (b.colleges.includes(college)) links.push({ type: "college", value: college });
  }
  for (const team of a.teams) {
    if (b.teams.includes(team)) links.push({ type: "team", value: team });
  }
  for (const num of a.numbers) {
    if (b.numbers.includes(num)) links.push({ type: "number", value: String(num) });
  }
  return links;
}

export function playersAreLinked(a: Player, b: Player): boolean {
  return sharedLinks(a, b).length > 0;
}

/** Does `value` (case-insensitive for college/team) count as `type` shared between a and b? */
export function isValidLink(a: Player, b: Player, type: LinkType, value: string): boolean {
  const links = sharedLinks(a, b);
  const norm = value.trim().toLowerCase();
  return links.some((l) => l.type === type && l.value.toLowerCase() === norm);
}

/** Every other player in the database linked to `player`, excluding ids in `exclude`. */
export function linkedCandidates(player: Player, exclude: Set<string>): Player[] {
  return players.filter((p) => !exclude.has(p.id) && playersAreLinked(player, p));
}

/** Pick a random computer move linked to the current player, or null if none remain. */
export function pickComputerMove(current: Player, exclude: Set<string>): Player | null {
  const candidates = linkedCandidates(current, exclude);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function formatLink(link: Link): string {
  if (link.type === "number") return `wore #${link.value}`;
  if (link.type === "college") return `played at ${link.value}`;
  return `played for ${link.value}`;
}
