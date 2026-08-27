import type { Player, PlayerPool } from "@/lib/players-db";
import { anyOtherPlayerHasLink } from "@/lib/players-db";

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

/** Every distinct college/team/number attribute a player has. */
export function allLinksOf(player: Player): Link[] {
  const links: Link[] = [];
  for (const college of player.colleges) links.push({ type: "college", value: college });
  for (const team of player.teams) links.push({ type: "team", value: team });
  for (const num of player.numbers) links.push({ type: "number", value: String(num) });
  return links;
}

/** Does `player` actually have this attribute (college/team/number)? */
export function playerHasLink(player: Player, link: Link): boolean {
  const norm = link.value.trim().toLowerCase();
  if (link.type === "college") return player.colleges.some((c) => c.toLowerCase() === norm);
  if (link.type === "team") return player.teams.some((t) => t.toLowerCase() === norm);
  return player.numbers.some((n) => String(n) === norm);
}

/**
 * Pick a random attribute of `current` that at least one other unused player also has.
 * This is what the computer "says" — the human must then name a player who matches it.
 *
 * `avoidType`, when given, keeps the computer from using the same kind of link
 * (college/team/number) two turns in a row — it's only used as a fallback if
 * every valid link happens to be that type.
 */
export async function pickComputerLink(
  current: Player,
  exclude: Set<string>,
  pool: PlayerPool,
  avoidType?: LinkType
): Promise<Link | null> {
  const links = allLinksOf(current);
  const viable = await Promise.all(
    links.map(async (link) => ({
      link,
      ok: await anyOtherPlayerHasLink(link.type, link.value, exclude, pool),
    }))
  );
  const candidates = viable.filter((v) => v.ok).map((v) => v.link);
  if (candidates.length === 0) return null;
  const preferred = avoidType ? candidates.filter((link) => link.type !== avoidType) : candidates;
  const finalPool = preferred.length > 0 ? preferred : candidates;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

/** Does `player` satisfy the announced link, and is it a fresh (unused) player? */
export function isValidGuess(link: Link, player: Player, exclude: Set<string>): boolean {
  return !exclude.has(player.id) && playerHasLink(player, link);
}

export function formatLink(link: Link): string {
  if (link.type === "number") return `wore #${link.value}`;
  if (link.type === "college") return `played at ${link.value}`;
  return `played for ${link.value}`;
}
