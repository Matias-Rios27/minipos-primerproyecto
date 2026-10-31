import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esNoEncontrado, getVentaDetalles } from "@/lib/api";
import HistorialDetalleClient from "./HistorialDetalleClient";

export default async function HistorialDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const supabase = await createClient();
  try {
    const venta = await getVentaDetalles(id, supabase);
    return <HistorialDetalleClient key={id} ventaInicial={venta} />;
  } catch (error) {
    // Solo "no existe" es un 404; cualquier otro fallo llega a error.tsx
    if (esNoEncontrado(error)) notFound();
    throw error;
  }
}
