import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isOnlineModeConfigured = Boolean(url && key);

export const supabase = isOnlineModeConfigured
  ? createClient(url as string, key as string)
  : null;
