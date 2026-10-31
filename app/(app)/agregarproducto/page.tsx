import { createClient } from "@/lib/supabase/server";
import { getCategorias, getProveedores } from "@/lib/api";
import AgregarProductoClient from "./AgregarProductoClient";

// Las listas de categorías y proveedores llegan en el HTML: los selects nacen con sus opciones
export default async function AgregarProductoPage() {
  const supabase = await createClient();
  const [categorias, proveedores] = await Promise.all([getCategorias(supabase), getProveedores(supabase)]);

  return <AgregarProductoClient categorias={categorias} proveedores={proveedores} />;
}
