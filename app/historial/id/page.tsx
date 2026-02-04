"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getNotificaciones } from "@/lib/api"; 
import { motion, AnimatePresence } from "framer-motion";
import { Alerta } from "@/types/types";

export default function DetalleVentaPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Estados para notificaciones
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);

  // 1. SINCRONIZACIÓN Y CARGA DE DATOS
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const timer = setTimeout(() => setIsMounted(true), 100);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const loadAlerts = async () => {
      try {
        const data = await getNotificaciones();
        setAlertas(data || []);
      } catch (e) {
        console.error("Error cargando alertas", e);
      }
    };
    loadAlerts();

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

  const theme = useMemo(() => ({
    bg: isDark ? "#0B1120" : "#F8FAFC",
    header: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
    card: isDark ? "#111827" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    subtle: isDark ? "#1F2937" : "#F1F5F9",
  }), [isDark]);

  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : ""}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER SUPERIOR */}
      <header 
        className="h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0"
        style={{ backgroundColor: theme.header, borderColor: theme.border }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">MP</div>
            <h1 className="text-lg font-bold">Detalle de Operación</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Revisando Folio #001 • Sucursal Quilicura
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex p-1 rounded-xl mr-4 border" style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button onClick={() => router.push("/historial")} className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Historial</button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Dashboard</button>
          </div>

          <button onClick={toggleDarkMode} className="p-2.5 rounded-xl border transition-all text-lg shadow-sm active:scale-90" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* BOTÓN Y DROPDOWN NOTIFICACIONES */}
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
                              <p className="opacity-50 mt-1">Revisar stock en Inventario</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center opacity-40 text-xs font-bold">Sin alertas pendientes</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">MT</div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          
          {/* BOTÓN VOLVER Y ACCIONES */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 font-bold text-sm transition-colors hover:text-blue-500 group"
              style={{ color: theme.textMuted }}
            >
              <span className="p-2 rounded-lg border shadow-sm transition-transform group-hover:-translate-x-1" style={{ backgroundColor: theme.card, borderColor: theme.border }}>←</span>
              Volver al Historial
            </button>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 border rounded-xl text-[10px] font-black transition-all shadow-sm active:scale-95"
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}>
                📥 EXPORTAR PDF
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A5F] rounded-xl text-[10px] font-black text-white hover:bg-slate-800 transition-all shadow-lg tracking-widest active:scale-95">
                🖨️ IMPRIMIR RECIBO
              </button>
            </div>
          </div>

          {/* TARJETA PRINCIPAL DE DETALLE */}
          <div 
            className="rounded-[32px] border shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[550px]"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            
            {/* 1. INFO LATERAL (IZQUIERDA) */}
            <div className="w-full lg:w-80 bg-[#1E3A5F] p-10 flex flex-col justify-between text-white">
              <div className="space-y-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">Folio de Venta</p>
                  <h3 className="text-6xl font-black italic tracking-tighter">#001</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="pb-6 border-b border-white/10">
                    <p className="text-[10px] font-black uppercase text-blue-300/60 mb-1">Fecha</p>
                    <p className="text-lg font-bold text-white">13 de Febrero, 2026</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-blue-300/60 mb-1">Cajero</p>
                    <p className="text-lg font-bold text-white">Marco Torres</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 space-y-3">
                <button onClick={() => router.push("/editarventa")} className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all shadow-lg active:scale-95">
                  EDITAR REGISTRO
                </button>
                <button className="w-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                  ANULAR VENTA
                </button>
              </div>
            </div>

            {/* 2. LISTADO DE PRODUCTOS (CENTRO) */}
            <div className="flex-1 p-10" style={{ backgroundColor: theme.card }}>
              <div className="flex items-center justify-between mb-8 border-b pb-4" style={{ borderColor: theme.border }}>
                <h4 className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Artículos Vendidos</h4>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: theme.subtle, color: theme.textMuted }}>3 items</span>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {[1, 2, 3].map((item) => (
                  <motion.div 
                    key={item}
                    whileHover={{ x: 5 }} 
                    className="border rounded-2xl p-4 flex items-center justify-between group"
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm border transition-transform group-hover:scale-110"
                        style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                        🥤
                      </div>
                      <div>
                        <p className="text-base font-black leading-none">Coca cola 3L</p>
                        <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-wider">Bebidas</p>
                      </div>
                    </div>
                    <div className="flex gap-12 items-center">
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase" style={{ color: theme.textMuted }}>Unitario</p>
                        <p className="text-sm font-black">$1.800</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase" style={{ color: theme.textMuted }}>Cant.</p>
                        <p className="text-xl font-black tracking-tighter">03</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 3. TOTALES (DERECHA) */}
            <div className="w-full lg:w-80 p-10 border-l flex flex-col justify-between" 
              style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", borderColor: theme.border }}>
              <div>
                <h4 className="font-black text-[10px] uppercase tracking-widest mb-8 pb-4 border-b" style={{ color: theme.textMuted, borderColor: theme.border }}>Resumen de Pago</h4>
                <div className="space-y-5">
                  <div className="flex justify-between text-sm font-bold" style={{ color: theme.textMuted }}>
                    <span>Sub-Total</span>
                    <span style={{ color: theme.text }}>$5.400</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black p-3 rounded-xl uppercase tracking-widest" style={{ backgroundColor: isDark ? "#064E3B" : "#ECFDF5", color: "#10B981" }}>
                    <span>Descuento</span>
                    <span>-$0</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t" style={{ borderColor: theme.border }}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: theme.textMuted }}>Monto Final</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-blue-500">$</span>
                  <h3 className="text-5xl font-black tracking-tighter italic" style={{ color: isDark ? "#FFF" : "#1E3A5F" }}>5.400</h3>
                </div>
                <div className="mt-6 p-4 border rounded-2xl flex items-center gap-3 shadow-sm transition-colors" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Pago en Efectivo</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}