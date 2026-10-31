import { createClient } from "@/lib/supabase/server";
import { getVentas } from "@/lib/api";
import HistorialClient from "./HistorialClient";

export default async function HistorialPage() {
  const supabase = await createClient();
  const ventas = await getVentas(supabase);

  return <HistorialClient ventasIniciales={ventas} />;
}
