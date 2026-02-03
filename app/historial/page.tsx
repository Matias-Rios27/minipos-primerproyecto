"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HistorialPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // <--- NUEVO: Control de transiciones

  // 1. SINCRONIZACIÓN Y PERMANENCIA
  useEffect(() => {
    // Sincronización inmediata con la clase del HTML
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    // Activamos transiciones después de un pequeño delay para evitar el flash al navegar
    const timer = setTimeout(() => setIsMounted(true), 100);

    // Observer por si cambia el tema desde otra pestaña o componente
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
    tableRow: isDark ? "hover:bg-blue-900/10" : "hover:bg-blue-50/30"
  };

  const historialVentas = [
    { id: "V-1024", fecha: "2026-02-02 14:30", cliente: "Publico General", total: 15500, items: 3, estado: "Completado" },
    { id: "V-1025", fecha: "2026-02-02 15:15", cliente: "Juan Pérez", total: 8900, items: 1, estado: "Completado" },
    { id: "V-1026", fecha: "2026-02-02 16:00", cliente: "Publico General", total: 45000, items: 12, estado: "Anulado" },
    { id: "V-1027", fecha: "2026-02-02 16:45", cliente: "María Soto", total: 12300, items: 4, estado: "Completado" },
  ];

  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${
        isMounted ? "transition-colors duration-500" : "transition-none"
      }`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER SUPERIOR */}
      <header 
        className={`h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0 ${
          isMounted ? "transition-colors duration-500" : "transition-none"
        }`}
        style={{ backgroundColor: theme.header, borderColor: theme.border }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">MP</div>
            <h1 className="text-lg font-bold" style={{ color: isDark ? "#FFF" : "#1E293B" }}>Gestión de Ventas</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Historial de Transacciones
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden md:flex p-1 rounded-xl mr-4 border ${
            isMounted ? "transition-colors duration-500" : "transition-none"
          }`} style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Historial</button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Dashboard</button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border transition-all text-lg shadow-sm hover:scale-105 active:scale-90"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <button className="p-2.5 rounded-xl border transition-all relative active:scale-90" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <span className="text-lg italic">🔔</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2" style={{ borderColor: theme.card }}></span>
            </button>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">MT</div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por ID de venta, cliente o fecha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full border rounded-2xl py-4 px-14 transition-all outline-none text-sm font-bold ${
                    isMounted ? "duration-500" : ""
                }`}
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
              />
              <span className="absolute left-5 top-4.5 opacity-30 text-xl">🔍</span>
            </div>
            <button className="bg-[#275791] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
              📥 Exportar Reporte
            </button>
          </div>

          <div 
            className={`rounded-3xl border shadow-xl overflow-hidden ${
                isMounted ? "transition-colors duration-500" : "transition-none"
            }`}
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: theme.subtle }} className={isMounted ? "transition-colors duration-500" : ""}>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>ID Transacción</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Marca de Tiempo</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Cliente</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Cant.</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Monto Total</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Estado</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-center" style={{ color: theme.textMuted }}>Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isMounted ? "transition-colors duration-500" : ""}`} style={{ borderColor: theme.border }}>
                <AnimatePresence>
                  {historialVentas.map((venta) => (
                    <motion.tr 
                      key={venta.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`transition-colors group ${theme.tableRow}`}
                    >
                      <td className="px-6 py-5">
                        <span className="font-black text-blue-500 text-sm">#{venta.id}</span>
                      </td>
                      <td className="px-6 py-5 text-[12px] font-bold" style={{ color: theme.textMuted }}>{venta.fecha}</td>
                      <td className="px-6 py-5 text-sm font-black uppercase tracking-tight">{venta.cliente}</td>
                      <td className="px-6 py-5 text-sm font-bold" style={{ color: theme.textMuted }}>{venta.items} un.</td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-emerald-500">
                          ${new Intl.NumberFormat("es-CL").format(venta.total)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          venta.estado === 'Completado' 
                            ? (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600') 
                            : (isDark ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-600')
                        }`}>
                          {venta.estado}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => router.push("/historial/id")}
                          className="p-2 rounded-xl border border-transparent transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90"
                          style={{ backgroundColor: theme.subtle, borderColor: theme.border }}
                        >
                          👁️‍🗨️
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {/* PAGINACIÓN */}
          <div className="mt-8 flex justify-between items-center px-4">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Sync: Quilicura_DB_v2</p>
            <div className="flex gap-2">
              <button className="px-6 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#1E3A5F] hover:text-white active:scale-95" style={{ backgroundColor: theme.card, borderColor: theme.border }}>Anterior</button>
              <button className="px-6 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#1E3A5F] hover:text-white active:scale-95" style={{ backgroundColor: theme.card, borderColor: theme.border }}>Siguiente</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}