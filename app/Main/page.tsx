import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/api";
import MainClient from "./MainClient";

// Los productos se piden en el servidor y llegan dentro del HTML: no hay espera tras hidratar
export default async function MainPage() {
  const supabase = await createClient();
  const productos = await getProducts(supabase);

  return <MainClient productosIniciales={productos} />;
}
