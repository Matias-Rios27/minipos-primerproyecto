import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/api";
import DashboardClient from "./DashboardClient";

// El período "mes" se calcula en el servidor; los otros períodos se piden al cambiar de pestaña
export default async function DashboardPage() {
  const supabase = await createClient();
  const stats = await getDashboardStats("mes", supabase);

  return <DashboardClient statsIniciales={stats} />;
}
