"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getNotificaciones, deleteNotificacion, getDashboardStats } from "@/lib/api";
import { Alerta, DashboardStats, FlujoCajaPunto, TopProducto } from "@/types/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "../components/Navbar";

// ── Componente: Gráfico de barras SVG ─────────────────────────────────────
function BarChart({ data, isDark }: { data: FlujoCajaPunto[]; isDark: boolean }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center opacity-30">
        <p className="text-xs font-black uppercase tracking-widest">Sin datos en este período</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.ingresos), 1);
  const barColor = isDark ? "#3B82F6" : "#1E3A5F";
  const gridColor = isDark ? "#1E293B" : "#E2E8F0";
  const textColor = isDark ? "#94A3B8" : "#64748B";

  return (
    <div className="h-[280px] w-full relative flex items-end gap-1 px-2">
      {/* Líneas de grilla */}
      {[0, 25, 50, 75, 100].map((pct) => (
        <div
          key={pct}
          className="absolute left-0 right-0 border-t border-dashed text-[9px] font-bold"
          style={{
            bottom: `${pct}%`,
            borderColor: gridColor,
            color: textColor,
          }}
        >
          <span className="absolute -left-1 -top-3 pl-0">
            {pct > 0
              ? `$${new Intl.NumberFormat("es-CL", { notation: "compact" }).format(
                  (maxVal * pct) / 100
                )}`
              : ""}
          </span>
        </div>
      ))}

      {/* Barras */}
      {data.map((point, i) => {
        const heightPct = maxVal > 0 ? (point.ingresos / maxVal) * 88 : 0;
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-end gap-1 group relative"
            title={`$${new Intl.NumberFormat("es-CL").format(point.ingresos)}`}
          >
            {/* Tooltip al hacer hover */}
            <div
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                         bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded-lg 
                         whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
            >
              ${new Intl.NumberFormat("es-CL").format(point.ingresos)}
              <br />
              <span className="opacity-60">{point.num_ventas} ventas</span>
            </div>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${heightPct}%` }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
              className="w-full rounded-t-lg relative overflow-hidden min-h-[4px]"
              style={{ backgroundColor: barColor }}
            >
              <div
                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.div>
            <span
              className="text-[9px] font-black uppercase"
              style={{ color: textColor }}
            >
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Componente: Barra de progreso de top producto ──────────────────────────
function TopProductoBar({
  prod,
  idx,
  isMounted,
  isDark,
}: {
  prod: TopProducto;
  idx: number;
  isMounted: boolean;
  isDark: boolean;
}) {
  const colors = ["#3B82F6", "#60A5FA", "#93C5FD", isDark ? "#334155" : "#CBD5E1"];
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[11px] font-black uppercase">
        <span className="tracking-widest truncate max-w-[60%]">{prod.nombre}</span>
        <span className="italic" style={{ color: "#3B82F6" }}>
          {prod.porcentaje}%
        </span>
      </div>
      <div
        className="w-full h-3 rounded-full overflow-hidden"
        style={{ backgroundColor: isDark ? "#1F2937" : "#F1F5F9" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isMounted ? `${prod.porcentaje}%` : 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.15 }}
          className="h-full rounded-full"
          style={{
            backgroundColor: colors[idx] || colors[3],
            boxShadow: `0 0 10px ${colors[idx] || colors[3]}40`,
          }}
        />
      </div>
      <p className="text-[9px] opacity-40 font-bold">
        {prod.total_vendido} unidades · $
        {new Intl.NumberFormat("es-CL").format(prod.total_monto)}
      </p>
    </div>
  );
}

// ── Componente: Dona de rendimiento ──────────────────────────────────────
function DonutGauge({ value, isDark }: { value: number; isDark: boolean }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const dashOffset = circumference - (circumference * clampedValue) / 100;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Track */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={isDark ? "#1F2937" : "#F1F5F9"}
          strokeWidth="14"
        />
        {/* Progress */}
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={isDark ? "#3B82F6" : "#1E3A5F"}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="absolute text-center">
        <p
          className="text-4xl font-black tracking-tighter"
          style={{ color: isDark ? "#60A5FA" : "#1E3A5F" }}
        >
          {clampedValue}%
        </p>
        <p
          className="text-[9px] font-black uppercase tracking-widest"
          style={{ color: isDark ? "#94A3B8" : "#64748B" }}
        >
          Margen Neto
        </p>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [periodo, setPeriodo] = useState<"semana" | "mes" | "año">("mes");
  const [userName, setUserName] = useState("Usuario");

  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Notificaciones
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const theme = {
    bg:       isDark ? "#0B1120" : "#F8FAFC",
    header:   isDark ? "rgba(17, 24, 39, 0.8)" : "rgba(255, 255, 255, 0.8)",
    card:     isDark ? "#111827" : "#FFFFFF",
    text:     isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border:   isDark ? "#1E293B" : "#E2E8F0",
    subtle:   isDark ? "#1F2937" : "#F1F5F9",
  };

  // ── Carga de datos ──────────────────────────────────────────────────────
  const loadStats = useCallback(async (p: "semana" | "mes" | "año") => {
    setLoadingStats(true);
    try {
      const data = await getDashboardStats(p);
      setStats(data);
    } catch (e) {
      console.error("Error cargando dashboard stats", e);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_name") || "Admin";
    setUserName(storedUser);

    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const timer = setTimeout(() => setIsMounted(true), 100);

    // Cargar alertas y stats en paralelo
    const loadAll = async () => {
      try {
        const [alertsData] = await Promise.all([getNotificaciones()]);
        setAlertas(alertsData || []);
      } catch (e) {
        console.error("Error cargando alertas", e);
      }
    };
    loadAll();
    loadStats("mes");

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotificaciones(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loadStats]);

  const handlePeriodoChange = (p: "semana" | "mes" | "año") => {
    setPeriodo(p);
    loadStats(p);
  };

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

  const generarInformePDF = () => {
    if (!stats) {
      alert("Cargando datos del informe...");
      return;
    }

    const doc = new jsPDF();
    const now = new Date().toLocaleString("es-CL");

    // Encabezado Superior
    doc.setFillColor(30, 58, 95); // #1E3A5F
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("MINI POS - INFORME GENERAL DE RENDIMIENTO", 14, 18);

    // Subtítulo / Metadata
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Período Seleccionado: ${periodo.toUpperCase()}`, 14, 36);
    doc.text(`Fecha y Hora de Emisión: ${now}`, 14, 42);
    doc.text(`Sucursal: Quilicura_POS_01`, 14, 48);

    // Línea divisoria
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 52, 196, 52);

    // 1. Resumen Ejecutivo (KPIs)
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.text("1. RESUMEN FINANCIERO CONSOLIDADO", 14, 60);

    const summaryData = [
      ["Indicador Financiero", "Monto / Valor (" + periodo + ")"],
      ["Ingresos Totales por Ventas", fmt(stats.totalIngresos)],
      ["Total Transacciones / Ventas", `${stats.totalVentas} ventas`],
      ["Ticket Promedio por Venta", fmt(stats.ticketPromedio)],
      ["Gastos Operativos y Compras de Inventario", fmt(stats.totalGastos)],
      ["Utilidad Neta del Período", fmt(stats.utilidadNeta)],
      ["Margen Neto de Ganancia", `${stats.margenGanancia}%`],
    ];

    autoTable(doc, {
      startY: 64,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: "striped",
      headStyles: { fillColor: [30, 58, 95], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    let currentY = (doc as any).lastAutoTable.finalY + 12;

    // 2. Top Productos
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.text("2. PRODUCTOS MÁS VENDIDOS (TOP)", 14, currentY);

    const topData = (stats.topProductos || []).map((p) => [
      p.nombre,
      `${p.total_vendido} unids`,
      fmt(p.total_monto),
      `${p.porcentaje}%`,
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [["Producto", "Unidades Vendidas", "Monto Total", "% del Total"]],
      body: topData.length > 0 ? topData : [["Sin ventas registradas en este período", "-", "-", "-"]],
      theme: "grid",
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontStyle: "bold" },
      styles: { fontSize: 9, cellPadding: 2.5 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;

    // 3. Flujo de Caja por Subperíodo
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.text("3. DETALLE DE FLUJO DE INGRESOS", 14, currentY);

    const flujoData = (stats.flujoCaja || []).map((f) => [
      f.label,
      `${f.num_ventas} ventas`,
      fmt(f.ingresos),
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [["Fecha / Período", "Ventas Realizadas", "Ingresos Totales"]],
      body: flujoData.length > 0 ? flujoData : [["Sin registros de flujo", "-", "-"]],
      theme: "plain",
      headStyles: { fillColor: [226, 232, 240], textColor: [30, 41, 59], fontStyle: "bold" },
      styles: { fontSize: 8.5, cellPadding: 2 },
    });

    // Pie de página
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Informe consolidado generado por MiniPOS MTZ • Página ${i} de ${totalPages}`,
        105,
        290,
        { align: "center" }
      );
    }

    doc.save(`Informe_General_${periodo.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const fmt = (n: number) => `$${new Intl.NumberFormat("es-CL").format(Math.round(n))}`;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex flex-col h-screen font-sans overflow-hidden ${
        isMounted ? "transition-colors duration-500" : ""
      }`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* ── HEADER ── */}
      <Navbar activePage="dashboard" />

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">

          {/* Título + selector de período + Botón PDF */}
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tighter italic uppercase leading-none">
                Dashboard Operativo
              </h2>
              <p className="text-sm font-medium mt-1" style={{ color: theme.textMuted }}>
                Análisis de rendimiento en tiempo real • Sucursal Quilicura
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={generarInformePDF}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A5F] hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <span>📄</span> Generar Informe PDF
              </button>

              <div
                className="flex gap-1 p-1.5 rounded-2xl border shadow-sm"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                {(["semana", "mes", "año"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handlePeriodoChange(t)}
                    className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 ${
                      periodo === t ? "bg-[#1E3A5F] text-white shadow-md" : ""
                    }`}
                    style={periodo !== t ? { color: theme.textMuted } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── KPIs ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            {/* Ingresos Totales */}
            <div className="bg-[#1E3A5F] p-7 rounded-[28px] shadow-xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-1">
                  Ingresos Totales
                </p>
                {loadingStats ? (
                  <div className="h-10 w-36 bg-white/10 rounded-xl animate-pulse mb-2" />
                ) : (
                  <h3 className="text-3xl font-black italic tracking-tighter">
                    {fmt(stats?.totalIngresos ?? 0)}
                  </h3>
                )}
                <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10 text-emerald-400 font-bold text-xs">
                  {loadingStats ? "—" : `Período: ${periodo}`}
                </div>
              </div>
              <span className="absolute -right-6 -bottom-6 text-9xl opacity-10 group-hover:rotate-12 transition-transform italic select-none">💰</span>
            </div>

            {/* Ventas Realizadas */}
            <div
              className="p-7 rounded-[28px] border shadow-sm group transition-colors duration-500"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: theme.textMuted }}>
                Ventas Realizadas
              </p>
              {loadingStats ? (
                <div className="h-10 w-20 rounded-xl animate-pulse mb-2" style={{ backgroundColor: theme.subtle }} />
              ) : (
                <h3 className="text-4xl font-black italic tracking-tighter">
                  {new Intl.NumberFormat("es-CL").format(stats?.totalVentas ?? 0)}
                </h3>
              )}
              <p className="text-xs mt-4 text-blue-600 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                Ticket Prom: {loadingStats ? "—" : fmt(stats?.ticketPromedio ?? 0)}
              </p>
            </div>

            {/* Gastos Operativos */}
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/gastos")}
              className="p-7 rounded-[28px] border shadow-sm cursor-pointer relative overflow-hidden group transition-colors duration-500"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: theme.textMuted }}>
                  Gastos Operativos
                </p>
                {loadingStats ? (
                  <div className="h-10 w-32 rounded-xl animate-pulse mb-2" style={{ backgroundColor: theme.subtle }} />
                ) : (
                  <h3 className="text-3xl font-black text-rose-500 italic tracking-tighter">
                    {fmt(stats?.totalGastos ?? 0)}
                  </h3>
                )}
                <p className="text-xs mt-4 font-bold flex items-center gap-2 text-rose-500/80">
                  Gestionar Gastos <span className="group-hover:translate-x-1 transition-transform">➜</span>
                </p>
              </div>
              <span className="absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:opacity-10 transition-opacity select-none">💸</span>
            </motion.div>

            {/* Utilidad Neta → Ver Balance */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-emerald-500 p-7 rounded-[28px] shadow-lg text-white cursor-pointer relative overflow-hidden group"
              onClick={() => router.push("/balance")}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Utilidad Neta</p>
              {loadingStats ? (
                <div className="h-10 w-32 bg-white/20 rounded-xl animate-pulse mb-2" />
              ) : (
                <h3 className="text-3xl font-black italic tracking-tighter">
                  {fmt(stats?.utilidadNeta ?? 0)}
                </h3>
              )}
              <p className="text-xs mt-4 font-bold flex items-center gap-2">
                Ver Balance Completo <span>➜</span>
              </p>
              <span className="absolute -right-4 -bottom-4 text-8xl opacity-20 group-hover:-translate-x-2 transition-transform select-none">📊</span>
            </motion.div>
          </div>

          {/* ── GRÁFICOS ── */}
          <div className="grid grid-cols-12 gap-6">

            {/* Flujo de Caja - Gráfico de barras */}
            <div
              className="col-span-12 lg:col-span-8 p-8 rounded-[32px] border transition-colors duration-500 shadow-sm"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-[0.3em]">
                    Flujo de Ingresos
                  </h4>
                  <p className="text-[10px] mt-1 font-medium" style={{ color: theme.textMuted }}>
                    {periodo === "semana" ? "Últimos 7 días" : periodo === "mes" ? "Mes actual por día" : "Año actual por mes"}
                  </p>
                </div>
                {!loadingStats && stats && (
                  <div
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                    style={{ backgroundColor: theme.subtle, color: theme.textMuted }}
                  >
                    {stats.flujoCaja.length} registros
                  </div>
                )}
              </div>

              {loadingStats ? (
                <div className="h-[280px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest">Cargando datos...</p>
                  </div>
                </div>
              ) : (
                <BarChart data={stats?.flujoCaja ?? []} isDark={isDark} />
              )}
            </div>

            {/* Margen de ganancia - Dona */}
            <div
              className="col-span-12 lg:col-span-4 p-8 rounded-[32px] border transition-colors duration-500 shadow-sm"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em] mb-6 text-center">
                Margen de Ganancia
              </h4>

              {loadingStats ? (
                <div className="flex justify-center">
                  <div className="w-44 h-44 rounded-full border-[14px] animate-pulse" style={{ borderColor: theme.subtle }} />
                </div>
              ) : (
                <div className="flex justify-center">
                  <DonutGauge value={stats?.margenGanancia ?? 0} isDark={isDark} />
                </div>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[10px] font-bold" style={{ color: theme.textMuted }}>
                  <span>Ingresos</span>
                  <span className="text-emerald-500">{loadingStats ? "—" : fmt(stats?.totalIngresos ?? 0)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold" style={{ color: theme.textMuted }}>
                  <span>Gastos</span>
                  <span className="text-rose-500">{loadingStats ? "—" : fmt(stats?.totalGastos ?? 0)}</span>
                </div>
                <div
                  className="flex justify-between text-[10px] font-black pt-2 border-t"
                  style={{ borderColor: theme.border }}
                >
                  <span>Utilidad</span>
                  <span className="text-blue-500">{loadingStats ? "—" : fmt(stats?.utilidadNeta ?? 0)}</span>
                </div>
              </div>
            </div>

            {/* Top 4 Productos más vendidos */}
            <div
              className="col-span-12 p-8 rounded-[32px] border transition-colors duration-500 shadow-sm"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-black uppercase text-[10px] tracking-[0.3em]">
                  Productos más vendidos (Top 4)
                </h4>
                <button
                  onClick={() => router.push("/inventario")}
                  className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  Ver Inventario →
                </button>
              </div>

              {loadingStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-4 w-3/4 rounded animate-pulse" style={{ backgroundColor: theme.subtle }} />
                      <div className="h-3 w-full rounded-full animate-pulse" style={{ backgroundColor: theme.subtle }} />
                    </div>
                  ))}
                </div>
              ) : !stats?.topProductos || stats.topProductos.length === 0 ? (
                <div className="text-center py-12 opacity-30">
                  <p className="text-xs font-black uppercase tracking-widest">
                    Sin ventas en este período
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {stats.topProductos.map((prod, idx) => (
                    <TopProductoBar
                      key={prod.producto_id}
                      prod={prod}
                      idx={idx}
                      isMounted={isMounted}
                      isDark={isDark}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}