// Lectura centralizada de las variables de Supabase.
// Next solo reemplaza NEXT_PUBLIC_* si se acceden con nombre literal, por eso no se usa process.env[nombre].

// Nombres de las variables que faltan o estan vacias (lista vacia = todo configurado)
export function variablesFaltantes() {
  const faltan: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) faltan.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) faltan.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return faltan;
}

export const mensajeVariablesFaltantes = (faltan: string[]) =>
  `Configuracion incompleta: faltan las variables ${faltan.join(" y ")}. ` +
  "Definelas en .env.local (local) o en Settings > Environment Variables de Vercel " +
  "(marcando Production, Preview y Development) y vuelve a desplegar sin usar la cache del build.";

export function variablesSupabase() {
  const faltan = variablesFaltantes();
  if (faltan.length > 0) throw new Error(mensajeVariablesFaltantes(faltan));

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
  };
}
