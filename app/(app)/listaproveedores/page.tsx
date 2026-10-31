import { createClient } from "@/lib/supabase/server";
import { getProveedores } from "@/lib/api";
import ListaProveedoresClient from "./ListaProveedoresClient";

export default async function ListaProveedoresPage() {
  const supabase = await createClient();
  const proveedores = await getProveedores(supabase);

  return <ListaProveedoresClient proveedoresIniciales={proveedores} />;
}
