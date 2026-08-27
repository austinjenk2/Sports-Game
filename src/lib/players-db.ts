import { supabase } from "./supabase";

export interface Player {
  id: string;
  name: string;
  colleges: string[];
  teams: string[];
  numbers: number[];
  first_season: number | null;
  last_season: number | null;
}

const SELECT_COLUMNS = "id,name,colleges,teams,numbers,first_season,last_season";

export async function getPlayerById(id: string): Promise<Player | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("players")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Player;
}

export async function searchPlayersByName(query: string, limit = 8): Promise<Player[]> {
  const q = query.trim();
  if (!q || !supabase) return [];
  const { data, error } = await supabase
    .from("players")
    .select(SELECT_COLUMNS)
    .ilike("name", `%${q}%`)
    .order("name", { ascending: true })
    .order("last_season", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error || !data) return [];
  return data as Player[];
}

/** Does at least one other, not-yet-used player also have this college/team/number? */
export async function anyOtherPlayerHasLink(
  type: "college" | "team" | "number",
  value: string,
  excludeIds: Set<string>
): Promise<boolean> {
  if (!supabase) return false;
  const column = type === "college" ? "colleges" : type === "team" ? "teams" : "numbers";
  const matchValue = type === "number" ? [Number(value)] : [value];
  let query = supabase.from("players").select("id").contains(column, matchValue).limit(1);
  if (excludeIds.size > 0) {
    query = query.not("id", "in", `(${[...excludeIds].join(",")})`);
  }
  const { data, error } = await query;
  if (error) return false;
  return (data?.length ?? 0) > 0;
}
