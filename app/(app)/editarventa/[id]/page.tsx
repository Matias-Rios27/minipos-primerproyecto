import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esNoEncontrado, getVentaDetalles } from "@/lib/api";
import EditarVentaClient from "./EditarVentaClient";

export default async function EditarVentaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const supabase = await createClient();
  try {
    const venta = await getVentaDetalles(id, supabase);
    return <EditarVentaClient key={id} ventaInicial={venta} />;
  } catch (error) {
    if (esNoEncontrado(error)) notFound();
    throw error;
  }
}
