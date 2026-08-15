"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getBalanceHistorico, getNotificaciones, deleteNotificacion } from "@/lib/api";
import { BalanceHistorico, BalanceMes, Alerta } from "@/types/types";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BalancePage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");

  // Datos de BD
  const [balance, setBalance] = useState<BalanceHistorico | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Notificaciones
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  const theme = {
    bg:        isDark ? "#0B1120" : "#F8FAFC",
    header:    isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
    card:      isDark ? "#111827" : "#FFFFFF",
    text:      isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border:    isDark ? "#1E293B" : "#E2E8F0",
    subtle:    isDark ? "#1F2937" : "#F1F5F9",
  };

  const fmt = (n: number) =>
    `$${new Intl.NumberFormat("es-CL").format(Math.round(Math.abs(n)))}`;

  // ── Carga inicial ──────────────────────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem("user_name") || "Admin";
    setUserName(storedUser);

    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    const timer = setTimeout(() => setIsMounted(true), 100);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const loadAll = async () => {
      setLoadingBalance(true);
      try {
        const [balData, alertsData] = await Promise.all([
          getBalanceHistorico(),
          getNotificaciones(),
        ]);
        setBalance(balData);
        setAlertas(alertsData || []);
      } catch (e) {
        console.error("Error cargando balance", e);
      } finally {
        setLoadingBalance(false);
      }
    };
    loadAll();

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleDeleteNotificacion = async (id: number) => {
    try {
      await deleteNotificacion(id);
      setAlertas((prev) => prev.filter((a) => a.notificacion_id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  // ── Exportar PDF ───────────────────────────────────────────────────────
  const exportarPDF = () => {
    if (!balance) return;
    const doc = new jsPDF();
    const fechaGen = new Date().toLocaleString("es-CL");

    doc.setFillColor(30, 58, 95);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("ESTADO DE RESULTADOS - MP", 14, 24);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado por: ${userName}  |  ${fechaGen}`, 14, 33);

    // KPIs principales
    const { mesActual } = balance;
    doc.setTextColor(30, 58, 95);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN MES ACTUAL", 14, 55);

    autoTable(doc, {
      startY: 60,
      head: [["Concepto", "Monto", "Variación"]],
      body: [
        ["Ingresos Brutos", fmt(mesActual.ingresos), `${balance.cambioIngresos >= 0 ? "+" : ""}${balance.cambioIngresos}% vs mes ant.`],
        ["Egresos Totales", `-${fmt(mesActual.gastos)}`, `${balance.cambioGastos >= 0 ? "+" : ""}${balance.cambioGastos}% vs mes ant.`],
        ["Utilidad Neta", fmt(mesActual.utilidad), `Margen: ${mesActual.margen}%`],
      ],
      theme: "grid",
      headStyles: { fillColor: [39, 87, 145], fontSize: 10, fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 1: { fontStyle: "bold" }, 2: { textColor: [100, 100, 100] } },
    });

    // Histórico
    const finalY = (doc as any).lastAutoTable?.finalY ?? 110;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.text("HISTÓRICO DE SOLVENCIA", 14, finalY + 15);

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Mes", "Ingresos", "Gastos", "Utilidad", "Margen"]],
      body: balance.historico.map((m) => [
        m.mes,
        fmt(m.ingresos),
        fmt(m.gastos),
        fmt(m.utilidad),
        `${m.margen}%`,
      ]),
      theme: "striped",
      headStyles: { fillColor: [39, 87, 145], fontSize: 9 },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    doc.save(`Balance_MiniPOS_${new Date().getTime()}.pdf`);
  };

  // ── Valores derivados ─────────────────────────────────────────────────
  const mes = balance?.mesActual;
  const maxIngreso = useMemo(
    () => Math.max(...(balance?.historico.map((m) => m.ingresos) ?? [1]), 1),
    [balance]
  );

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex flex-col h-screen font-sans overflow-hidden ${
        isMounted ? "transition-colors duration-500" : ""
      }`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* ── HEADER ── */}
      <Navbar activePage="balance" />

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">

          {/* Título + botones */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                Estado de Resultados
              </h2>
              <p className="text-sm font-medium mt-1" style={{ color: theme.textMuted }}>
                {loadingBalance ? "Sincronizando datos..." : `Mes actual · ${balance?.historico.length ?? 0} meses históricos`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportarPDF}
                disabled={loadingBalance || !balance}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] border rounded-2xl transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
              >
                📄 Exportar PDF
              </button>
              <button
                onClick={() => router.push("/gastos")}
                className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] bg-[#1E3A5F] text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                💸 Ver Gastos
              </button>
            </div>
          </div>

          {/* ── KPIs MES ACTUAL ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

            {/* Ingresos Brutos */}
            <div
              className="p-8 rounded-[32px] border-t-8 border-emerald-500 shadow-xl transition-colors duration-500"
              style={{ backgroundColor: theme.card }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: theme.textMuted }}>
                Ingresos Brutos
              </p>
              {loadingBalance ? (
                <div className="h-12 w-3/4 rounded-xl animate-pulse mb-4" style={{ backgroundColor: theme.subtle }} />
              ) : (
                <h3 className="text-4xl font-black tracking-tighter italic text-emerald-600">
                  +{fmt(mes?.ingresos ?? 0)}
                </h3>
              )}
              <div
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: isDark ? "#064E3B" : "#ECFDF5", color: "#10B981" }}
              >
                {loadingBalance ? "—" : (
                  <>
                    <span>{balance?.cambioIngresos !== undefined ? (balance.cambioIngresos >= 0 ? "↑" : "↓") : ""}</span>
                    <span>{balance?.cambioIngresos !== undefined ? `${Math.abs(balance.cambioIngresos)}%` : "—"}</span>
                    <span className="opacity-60 font-medium">vs mes anterior</span>
                  </>
                )}
              </div>
              {!loadingBalance && (
                <p className="text-[10px] mt-3 font-bold opacity-50">
                  {mes?.ventas ?? 0} ventas realizadas
                </p>
              )}
            </div>

            {/* Egresos Totales */}
            <div
              className="p-8 rounded-[32px] border-t-8 border-rose-500 shadow-xl transition-colors duration-500"
              style={{ backgroundColor: theme.card }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: theme.textMuted }}>
                Egresos Totales
              </p>
              {loadingBalance ? (
                <div className="h-12 w-3/4 rounded-xl animate-pulse mb-4" style={{ backgroundColor: theme.subtle }} />
              ) : (
                <h3 className="text-4xl font-black tracking-tighter italic text-rose-500">
                  -{fmt(mes?.gastos ?? 0)}
                </h3>
              )}
              <div
                className="mt-6 inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: isDark ? "#451A03" : "#FFF1F2", color: "#F43F5E" }}
              >
                {loadingBalance ? "—" : (
                  <>
                    <span>{balance?.cambioGastos !== undefined ? (balance.cambioGastos >= 0 ? "↑" : "↓") : ""}</span>
                    <span>{balance?.cambioGastos !== undefined ? `${Math.abs(balance.cambioGastos)}%` : "—"}</span>
                    <span className="opacity-60 font-medium">vs mes anterior</span>
                  </>
                )}
              </div>
              {!loadingBalance && (
                <button
                  onClick={() => router.push("/gastos")}
                  className="text-[10px] mt-3 font-black opacity-50 hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  Ver detalle →
                </button>
              )}
            </div>

            {/* Utilidad Neta */}
            <div className="bg-[#1E3A5F] p-8 rounded-[32px] shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-blue-300/60 tracking-widest mb-1">
                  Utilidad Neta
                </p>
                {loadingBalance ? (
                  <div className="h-12 w-3/4 bg-white/20 rounded-xl animate-pulse mb-4" />
                ) : (
                  <h3 className="text-4xl font-black tracking-tighter italic text-emerald-400">
                    {fmt(mes?.utilidad ?? 0)}
                  </h3>
                )}
                <div className="mt-6">
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1.5 text-white/40">
                    <span>Margen de Ganancia</span>
                    <span>{loadingBalance ? "—" : `${mes?.margen ?? 0}%`}</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: isMounted ? `${Math.min(mes?.margen ?? 0, 100)}%` : 0 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                </div>
              </div>
              <span className="absolute -right-6 -bottom-6 text-9xl opacity-5 font-black italic select-none">Σ</span>
            </div>
          </div>

          {/* ── GRÁFICO HISTÓRICO ── */}
          <div
            className="p-10 rounded-[40px] border shadow-sm mb-10 transition-colors duration-500"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <div className="flex justify-between items-center mb-10">
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em]">
                Histórico de Solvencia
              </h4>
              <div className="flex gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase" style={{ color: theme.textMuted }}>Ingresos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-black uppercase" style={{ color: theme.textMuted }}>Gastos</span>
                </div>
              </div>
            </div>

            {loadingBalance ? (
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-8">
                    <div className="h-4 w-28 rounded animate-pulse" style={{ backgroundColor: theme.subtle }} />
                    <div className="flex-1 h-10 rounded-2xl animate-pulse" style={{ backgroundColor: theme.subtle }} />
                    <div className="h-4 w-16 rounded animate-pulse" style={{ backgroundColor: theme.subtle }} />
                  </div>
                ))}
              </div>
            ) : balance?.historico.length === 0 ? (
              <div className="py-16 text-center opacity-30">
                <p className="text-xs font-black uppercase tracking-widest">Sin datos históricos disponibles</p>
              </div>
            ) : (
              <div className="space-y-8 max-w-5xl mx-auto">
                {balance?.historico.map((data: BalanceMes, idx: number) => {
                  const ingPct = maxIngreso > 0 ? (data.ingresos / maxIngreso) * 82 : 0;
                  const gasPct = maxIngreso > 0 ? (data.gastos / maxIngreso) * 82 : 0;

                  return (
                    <div key={idx} className="flex items-center gap-6 group">
                      <span
                        className="text-[10px] font-black w-28 uppercase shrink-0 transition-colors"
                        style={{ color: theme.textMuted }}
                      >
                        {data.mes}
                      </span>
                      <div className="flex-1 h-10 flex gap-1.5 items-center">
                        {/* Barra ingresos */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isMounted ? `${ingPct}%` : 0 }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="bg-emerald-500 h-full rounded-2xl shadow-lg flex items-center justify-end px-3 overflow-hidden min-w-[4px]"
                        >
                          {ingPct > 15 && (
                            <span className="text-[8px] font-black text-white whitespace-nowrap">
                              {fmt(data.ingresos)}
                            </span>
                          )}
                        </motion.div>
                        {/* Barra gastos */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isMounted ? `${gasPct}%` : 0 }}
                          transition={{ duration: 1, delay: idx * 0.1 + 0.2 }}
                          className="bg-rose-500 h-full rounded-2xl shadow-lg flex items-center justify-end px-3 overflow-hidden min-w-[4px]"
                        >
                          {gasPct > 15 && (
                            <span className="text-[8px] font-black text-white whitespace-nowrap">
                              {fmt(data.gastos)}
                            </span>
                          )}
                        </motion.div>
                      </div>
                      <div className="text-right w-24 shrink-0">
                        <p
                          className="text-sm font-black italic"
                          style={{ color: data.utilidad >= 0 ? "#10B981" : "#F43F5E" }}
                        >
                          {data.utilidad >= 0 ? "+" : "-"}{fmt(data.utilidad)}
                        </p>
                        <p className="text-[9px] font-bold opacity-40">{data.margen}% margen</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── DISTRIBUCIÓN DE EGRESOS + INSIGHT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">

            {/* Distribución por categoría */}
            <div
              className="p-8 rounded-[32px] border shadow-sm transition-colors duration-500"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <h5
                className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 pb-5 border-b flex items-center gap-2"
                style={{ color: "#60A5FA", borderColor: theme.border }}
              >
                <span>📋</span> Distribución de Egresos (Mes Actual)
              </h5>

              {loadingBalance ? (
                <div className="space-y-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl animate-pulse" style={{ backgroundColor: theme.subtle }} />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/2 rounded animate-pulse" style={{ backgroundColor: theme.subtle }} />
                        <div className="h-2 w-full rounded animate-pulse" style={{ backgroundColor: theme.subtle }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !balance?.gastosDistribucion || balance.gastosDistribucion.length === 0 ? (
                <div className="py-12 text-center opacity-30">
                  <p className="text-xs font-black uppercase tracking-widest">
                    Sin egresos en el mes actual
                  </p>
                  <button
                    onClick={() => router.push("/gastos")}
                    className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Registrar primer gasto →
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {balance.gastosDistribucion.map((dist, idx) => (
                    <div key={idx} className="group cursor-pointer hover:translate-x-1 transition-transform">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-black">{dist.categoria}</span>
                        <div className="text-right">
                          <p className="text-sm font-black">{fmt(dist.total)}</p>
                          <p
                            className="text-[9px] uppercase font-bold"
                            style={{ color: idx === 0 ? "#F97316" : "#3B82F6" }}
                          >
                            {dist.porcentaje}% del gasto
                          </p>
                        </div>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: theme.subtle }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isMounted ? `${dist.porcentaje}%` : 0 }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: idx === 0 ? "#F97316" : idx === 1 ? "#3B82F6" : "#8B5CF6",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Insight / Recomendación */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-[#1E3A5F] p-10 rounded-[32px] shadow-2xl flex flex-col justify-center items-center text-center relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-400/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-emerald-400/30">
                  <span className="text-2xl">💡</span>
                </div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">
                  Análisis Automático
                </p>

                {loadingBalance ? (
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-white/10 rounded mx-auto animate-pulse" />
                    <div className="h-4 w-1/2 bg-white/10 rounded mx-auto animate-pulse" />
                  </div>
                ) : (
                  <p className="text-lg font-medium text-white/90 leading-relaxed italic px-4">
                    {mes && mes.margen >= 60
                      ? `"Tu margen de "${mes.margen}%" es excepcional. Considera reinvertir en stock para maximizar el siguiente período."`
                      : mes && mes.margen >= 30
                      ? `"Margen del ${mes.margen}%. Hay oportunidad de reducir egresos optimizando proveedores y servicios."`
                      : mes && mes.margen > 0
                      ? `"Margen del ${mes.margen}%. Revisa tus categorías de gasto principales para mejorar la rentabilidad."`
                      : mes && mes.ingresos === 0
                      ? '"Sin ventas registradas este mes. Comienza vendiendo desde el Punto de Venta."'
                      : '"Los egresos superan los ingresos este período. Revisa los gastos y maximiza las ventas."'}
                  </p>
                )}

                {!loadingBalance && mes && (
                  <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <p className="text-[9px] text-blue-300/60 uppercase font-black">Ventas</p>
                      <p className="text-xl font-black text-white">{mes.ventas}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <p className="text-[9px] text-blue-300/60 uppercase font-black">Margen</p>
                      <p className="text-xl font-black text-emerald-400">{mes.margen}%</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/5 rounded-full -ml-16 -mb-16" />
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}