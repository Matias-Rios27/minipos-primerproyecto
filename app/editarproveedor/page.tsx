"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Interfaz para el tipado de alertas
interface Alerta {
  notificacion_id: number;
  tipo: 'stock' | 'vencimiento';
  mensaje: string;
}

export default function EditarProveedorPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // ESTADOS PARA NOTIFICACIONES
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  // 1. SINCRONIZACIÓN Y PERMANENCIA DEL TEMA
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const timer = setTimeout(() => setIsMounted(true), 100);

    // Cerrar notificaciones al hacer clic fuera
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
    header: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
    card: isDark ? "#111827" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    subtle: isDark ? "#1F2937" : "#F1F5F9",
  };

  const inputClass = "w-full border rounded-2xl py-4 px-6 outline-none transition-all text-sm font-bold focus:ring-4 focus:ring-blue-500/10";
  const labelClass = "text-[10px] font-black uppercase ml-2 mb-2 block tracking-widest";

  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER */}
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

            {/* SISTEMA DE NOTIFICACIONES INCORPORADO */}
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
                                <p className="opacity-50 mt-1 uppercase text-[9px]">Ver detalles en inventario</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center opacity-40 text-xs font-bold uppercase tracking-tighter">Sin alertas pendientes</div>
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
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => router.back()} 
            className="mb-6 flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span> Volver sin Guardar
          </button>

          <div 
            className="rounded-3xl border shadow-2xl overflow-hidden" 
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            {/* ENCABEZADO DE LA FICHA DE EDICIÓN */}
            <div className="p-8 border-b flex justify-between items-center" 
                 style={{ borderColor: theme.border, backgroundColor: theme.subtle }}>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-amber-500">Edición de Proveedor</h2>
                <p className="text-xs font-bold opacity-50 uppercase">ID Registro: #PROV-99281</p>
              </div>
              <div className="flex items-center gap-3 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl border border-amber-500/20">
                <span className="text-[10px] font-black uppercase">Modo Edición</span>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <form className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="md:col-span-1 flex flex-col gap-4">
                <label className={labelClass} style={{ color: theme.textMuted }}>Logo Corporativo</label>
                <div 
                  className="aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all group cursor-pointer"
                  style={{ borderColor: theme.border, backgroundColor: theme.subtle }}
                >
                  <span className="text-5xl mb-2">🏭</span>
                  <p className="text-[9px] font-black uppercase text-center opacity-40 px-4">Cambiar Imagen</p>
                </div>
                <div className="mt-2 p-4 rounded-2xl border bg-amber-500/5 border-amber-500/10">
                   <p className="text-[9px] font-black uppercase text-amber-600 mb-1">Última Compra</p>
                   <p className="text-sm font-bold tracking-tight">12 de Enero, 2026</p>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: theme.textMuted }}>Razón Social</label>
                  <input type="text" defaultValue="TAL TAL S.A." className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                </div>

                <div>
                  <label className={labelClass} style={{ color: theme.textMuted }}>RUT Empresa</label>
                  <input type="text" defaultValue="76.123.456-K" className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                </div>

                <div>
                  <label className={labelClass} style={{ color: theme.textMuted }}>Categoría</label>
                  <select defaultValue="Bebidas" className={inputClass} style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }}>
                    <option>Bebidas</option>
                    <option>Abarrotes</option>
                    <option>Limpieza</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass} style={{ color: theme.textMuted }}>Contacto Directo</label>
                  <input type="text" defaultValue="Juan Pérez" className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                </div>

                <div>
                  <label className={labelClass} style={{ color: theme.textMuted }}>Teléfono</label>
                  <input type="tel" defaultValue="+56 9 8765 4321" className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: theme.textMuted }}>Dirección Comercial</label>
                  <input type="text" defaultValue="Parque Industrial Enea, Pudahuel" className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                </div>
              </div>

              <div className="md:col-span-3 pt-6 mt-6 border-t flex flex-col sm:flex-row gap-4" style={{ borderColor: theme.border }}>
                <button type="submit" className="flex-1 bg-amber-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                  🔄 Actualizar Información
                </button>
                <button type="button" className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border transition-all text-rose-500 border-rose-500/20 hover:bg-rose-500/5 active:scale-95">
                  🗑️ Eliminar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}