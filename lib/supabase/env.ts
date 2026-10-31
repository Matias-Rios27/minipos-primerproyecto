// Lectura centralizada de las variables de Supabase.
// Next solo reemplaza NEXT_PUBLIC_* si se acceden con nombre literal, por eso no se usa process.env[nombre].
export function variablesSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. " +
        "Definelas en .env.local (local) o en Settings > Environment Variables (Vercel) y vuelve a desplegar."
    );
  }

  return { url, key };
}
