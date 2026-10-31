import { createClient } from "@/lib/supabase/server";
import { getBalanceHistorico } from "@/lib/api";
import BalanceClient from "./BalanceClient";

export default async function BalancePage() {
  const supabase = await createClient();
  const balance = await getBalanceHistorico(supabase);

  return <BalanceClient balanceInicial={balance} />;
}
