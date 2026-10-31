import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esNoEncontrado, getCategorias, getProductById, getProveedores } from "@/lib/api";
import EditarProductoClient from "./EditarProductoClient";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const supabase = await createClient();
  try {
    const [producto, proveedores, categorias] = await Promise.all([
      getProductById(Number(id), supabase),
      getProveedores(supabase),
      getCategorias(supabase),
    ]);

    // key fuerza un componente nuevo al cambiar de producto: el formulario no arrastra datos del anterior
    return (
      <EditarProductoClient key={id} productoInicial={producto} proveedores={proveedores} categorias={categorias} />
    );
  } catch (error) {
    if (esNoEncontrado(error)) notFound();
    throw error;
  }
}
