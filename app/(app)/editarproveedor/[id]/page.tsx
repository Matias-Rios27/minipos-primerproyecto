import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esNoEncontrado, getProveedorById } from "@/lib/api";
import EditarProveedorClient from "./EditarProveedorClient";

export default async function EditarProveedorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const supabase = await createClient();
  try {
    const proveedor = await getProveedorById(Number(id), supabase);
    return <EditarProveedorClient key={id} proveedor={proveedor} />;
  } catch (error) {
    if (esNoEncontrado(error)) notFound();
    throw error;
  }
}
