import { createClient } from "@/lib/supabase/server";
import { ErrorApi, getUsuarios } from "@/lib/api";
import UsuariosClient from "./UsuariosClient";

export default async function UsuariosPage() {
  const supabase = await createClient();

  // listar_usuarios es solo para dueños (42501 = no autorizado): el resto ve la lista vacía
  const usuarios = await getUsuarios(supabase).catch((error) => {
    if (error instanceof ErrorApi && error.code === "42501") return [];
    throw error;
  });

  return <UsuariosClient usuariosIniciales={usuarios} />;
}
