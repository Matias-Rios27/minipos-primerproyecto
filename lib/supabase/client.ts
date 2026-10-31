import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { variablesSupabase } from "./env";

export const createClient = () => {
  const { url, key } = variablesSupabase();
  return createBrowserClient<Database>(url, key);
};
