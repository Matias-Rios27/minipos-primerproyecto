import { createClient } from "@/lib/supabase/server";
import { getCategoriasGasto, getGastos } from "@/lib/api";
import GastosClient from "./GastosClient";

export default async function GastosPage() {
  const supabase = await createClient();
  const [gastos, categorias] = await Promise.all([getGastos(supabase), getCategoriasGasto(supabase)]);

  return <GastosClient gastosIniciales={gastos} categoriasIniciales={categorias} />;
}
