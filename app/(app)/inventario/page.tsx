import { createClient } from "@/lib/supabase/server";
import { getProducts, getProveedores } from "@/lib/api";
import InventarioClient from "./InventarioClient";

// Los datos se piden en el servidor y llegan dentro del HTML: no hay espera tras hidratar
export default async function InventarioPage() {
  const supabase = await createClient();
  const [productos, proveedores] = await Promise.all([
    getProducts(supabase),
    getProveedores(supabase),
  ]);

  return <InventarioClient productosIniciales={productos} proveedoresIniciales={proveedores} />;
}
