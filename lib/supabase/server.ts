import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { cookies } from "next/headers";
import { variablesSupabase } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = variablesSupabase();

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se llama desde un Server Component: no puede escribir cookies.
            // Es seguro ignorarlo porque proxy.ts renueva la sesion.
          }
        },
      },
    }
  );
}
