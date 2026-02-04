"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getNotificaciones } from "@/lib/api";
import { Alerta } from "@/types/types";

export default function DashboardPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [periodo, setPeriodo] = useState("Semana");

  // ESTADOS PARA NOTIFICACIONES
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  // 1. SINCRONIZACIÓN DE TEMA Y CARGA DE DATOS
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const timer = setTimeout(() => setIsMounted(true), 100);

    const loadAlerts = async () => {
      try {
        const data = await getNotificaciones();
        setAlertas(data || []);
      } catch (e) {
        console.error("Error cargando alertas", e);
      }
    };
    loadAlerts();

    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotificaciones(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
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

  const theme = {
    bg: isDark ? "#0B1120" : "#F8FAFC",
    header: isDark ? "rgba(17, 24, 39, 0.8)" : "rgba(255, 255, 255, 0.8)",
    card: isDark ? "#111827" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    subtle: isDark ? "#1F2937" : "#F1F5F9"
  };

  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : ""}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER SUPERIOR */}
      <header 
        className={`h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0 ${isMounted ? "transition-colors duration-500" : ""}`}
        style={{ backgroundColor: theme.header, borderColor: theme.border }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">MP</div>
            <h1 className="text-lg font-bold">Panel de Control</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Estado del Sistema: Óptimo • Quilicura Online
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden md:flex p-1 rounded-xl mr-4 border transition-colors ${isMounted ? "duration-500" : ""}`} 
            style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button onClick={() => router.push("/historial")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Historial</button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
            <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Dashboard</button>
          </div>

          <div className="flex items-center gap-2" ref={notifRef}>
            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl border transition-all text-lg shadow-sm active:scale-90" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* CONTENEDOR DE NOTIFICACIONES */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificaciones(!showNotificaciones)}
                className="p-2.5 rounded-xl border transition-all relative active:scale-90 hover:bg-slate-500/5" 
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                <span className="text-lg italic">🔔</span>
                {alertas.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-[#111827]">
                    {alertas.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotificaciones && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 rounded-3xl border shadow-2xl z-50 overflow-hidden"
                    style={{ backgroundColor: theme.card, borderColor: theme.border }}
                  >
                    <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: theme.border, backgroundColor: theme.subtle }}>
                      <h3 className="text-xs font-black uppercase tracking-widest">Alertas Recientes</h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] text-white font-bold">{alertas.length}</span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {alertas.length > 0 ? (
                        alertas.map((alerta) => (
                          <div key={alerta.notificacion_id} className="p-4 border-b last:border-0 hover:bg-slate-500/5 transition-colors" style={{ borderColor: theme.border }}>
                            <div className="flex gap-3 text-xs">
                              <span className="text-lg">{alerta.tipo === 'stock' ? '📉' : '⚠️'}</span>
                              <div>
                                <p className="font-bold">{alerta.mensaje}</p>
                                <p className="opacity-50 mt-1 uppercase text-[9px]">Revisar en Inventario</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center opacity-40 text-xs font-bold uppercase tracking-widest">Sin alertas pendientes</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">MT</div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tighter italic uppercase leading-none">Dashboard Operativo</h2>
              <p className="text-sm font-medium mt-1" style={{ color: theme.textMuted }}>Análisis de rendimiento: Sucursal Quilicura</p>
            </div>
            
            <div className="flex gap-1 p-1.5 rounded-2xl border shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              {["Semana", "Mes", "Año"].map((t) => (
                <button
                  key={t}
                  onClick={() => setPeriodo(t)}
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

          {/* SECCIÓN 1: KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1E3A5F] p-7 rounded-[28px] shadow-xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-1">Ingresos Totales</p>
                <h3 className="text-4xl font-black italic tracking-tighter">$2.840.000</h3>
                <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10 text-emerald-400 font-bold text-xs">▲ +12.5%</div>
              </div>
              <span className="absolute -right-6 -bottom-6 text-9xl opacity-10 group-hover:rotate-12 transition-transform italic select-none">💰</span>
            </div>

            <div className="p-7 rounded-[28px] border shadow-sm group transition-colors duration-500" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: theme.textMuted }}>Ventas Realizadas</p>
              <h3 className="text-4xl font-black italic tracking-tighter">1,248</h3>
              <p className="text-xs mt-4 text-blue-600 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                Ticket Promedio: $12.500
              </p>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/gastos")}
              className="p-7 rounded-[28px] border shadow-sm cursor-pointer relative overflow-hidden group transition-colors duration-500" 
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: theme.textMuted }}>Gastos Operativos</p>
                <h3 className="text-4xl font-black text-rose-500 italic tracking-tighter">$420.150</h3>
                <p className="text-xs mt-4 font-bold flex items-center gap-2 text-rose-500/80">
                  Gestionar Gastos <span className="group-hover:translate-x-1 transition-transform">➜</span>
                </p>
              </div>
              <span className="absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:opacity-10 transition-opacity select-none">💸</span>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-emerald-500 p-7 rounded-[28px] shadow-lg text-white cursor-pointer relative overflow-hidden group"
              onClick={() => router.push("/balance")}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Estado Operativo</p>
              <h3 className="text-3xl font-black italic tracking-tighter">Ver Balance</h3>
              <p className="text-xs mt-4 font-bold flex items-center gap-2">Generar Reporte PDF <span>➜</span></p>
              <span className="absolute -right-4 -bottom-4 text-8xl opacity-20 group-hover:-translate-x-2 transition-transform select-none">📊</span>
            </motion.div>
          </div>

          {/* SECCIÓN 2: GRÁFICOS */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 p-8 rounded-[32px] border transition-colors duration-500 shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-black uppercase text-[10px] tracking-[0.3em]">Flujo de Caja Mensual</h4>
              </div>
              <div className={`h-[300px] w-full rounded-[24px] border border-dashed flex flex-col items-center justify-center ${isMounted ? "transition-colors duration-500" : ""}`} 
                   style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
                <p style={{ color: theme.textMuted }} className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Visualización de Datos Reales pendiente de enlace</p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 p-8 rounded-[32px] border transition-colors duration-500 shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em] mb-10 text-center">Rendimiento Semanal</h4>
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-48 h-48 rounded-full border-[14px] flex items-center justify-center shadow-inner" style={{ borderColor: theme.subtle, borderTopColor: "#3B82F6", borderRightColor: "#3B82F6" }}>
                  <div className="text-center">
                    <p className="text-4xl font-black tracking-tighter" style={{ color: isDark ? "#60A5FA" : "#1E3A5F" }}>72%</p>
                    <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Meta Lograda</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-[11px] font-bold opacity-60 px-4 italic">El volumen de transacciones ha crecido un 4% respecto a ayer.</p>
            </div>

            {/* PRODUCTOS ESTRELLA */}
            <div className="col-span-12 p-8 rounded-[32px] border transition-colors duration-500 shadow-sm" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em] mb-8">Productos más vendidos (Top 4)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  { name: "Coca Cola 3L", val: "95%", color: "bg-blue-500" },
                  { name: "Aceite Vegetal 1L", val: "72%", color: "bg-blue-400" },
                  { name: "Pan Batido (Kg)", val: "60%", color: "bg-blue-300" },
                  { name: "Cigarrillos (Pack)", val: "35%", color: isDark ? "bg-slate-700" : "bg-slate-300" },
                ].map((prod, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between text-[11px] font-black uppercase">
                      <span className="tracking-widest">{prod.name}</span>
                      <span className="text-blue-600 italic">{prod.val}</span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.subtle }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isMounted ? prod.val : 0 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.1 }}
                        className={`${prod.color} h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)]`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}