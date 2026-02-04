"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getNotificaciones } from "@/lib/api"; // Asegúrate de tener este helper
import { Alerta } from "@/types/types";

export default function HistorialPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  // ESTADOS PARA NOTIFICACIONES
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);

  // 1. SINCRONIZACIÓN Y PERMANENCIA
  useEffect(() => {
    const storedUser = localStorage.getItem("user_name") || "Admin"; 
    setUserName(storedUser);

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

    // Carga inicial de alertas
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

  // PALETA DINÁMICA
  const theme = useMemo(() => ({
    bg: isDark ? "#0B1120" : "#F8FAFC",
    header: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
    card: isDark ? "#111827" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    subtle: isDark ? "#1F2937" : "#F1F5F9",
    tableRow: isDark ? "hover:bg-blue-900/10" : "hover:bg-blue-50/30"
  }), [isDark]);

  const historialVentas = [
    { id: "V-1024", fecha: "2026-02-02 14:30", cliente: "Publico General", total: 15500, items: 3, estado: "Completado" },
    { id: "V-1025", fecha: "2026-02-02 15:15", cliente: "Juan Pérez", total: 8900, items: 1, estado: "Completado" },
    { id: "V-1026", fecha: "2026-02-02 16:00", cliente: "Publico General", total: 45000, items: 12, estado: "Anulado" },
    { id: "V-1027", fecha: "2026-02-02 16:45", cliente: "María Soto", total: 12300, items: 4, estado: "Completado" },
  ];

  const filteredVentas = historialVentas.filter(venta => 
    venta.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER SUPERIOR */}
      <header 
        className={`h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0 ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
        style={{ backgroundColor: theme.header, borderColor: theme.border }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">MP</div>
            <h1 className="text-lg font-bold">Gestión de Ventas</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Historial de Transacciones
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden md:flex p-1 rounded-xl mr-4 border ${isMounted ? "transition-colors duration-500" : ""}`} style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Historial</button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Dashboard</button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl border transition-all text-lg shadow-sm hover:scale-105" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              {isDark ? "☀️" : "🌙"}
            </button>

            {/* DROPDOWN NOTIFICACIONES */}
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
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
            {userName.substring(0, 2).toUpperCase()}
          </div>
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
                className="w-full border rounded-2xl py-4 px-14 outline-none text-sm font-bold"
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
              />
              <span className="absolute left-5 top-4.5 opacity-30 text-xl">🔍</span>
            </div>
            <button className="bg-[#275791] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
              📥 Exportar Reporte
            </button>
          </div>

          <div 
            className="rounded-3xl border shadow-xl overflow-hidden"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: theme.subtle }}>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>ID Transacción</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Marca de Tiempo</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Cliente</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Cant.</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Monto Total</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>Estado</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-center" style={{ color: theme.textMuted }}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: theme.border }}>
                <AnimatePresence>
                  {filteredVentas.map((venta) => (
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
              <button className="px-6 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#1E3A5F] hover:text-white" style={{ backgroundColor: theme.card, borderColor: theme.border }}>Anterior</button>
              <button className="px-6 py-2.5 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#1E3A5F] hover:text-white" style={{ backgroundColor: theme.card, borderColor: theme.border }}>Siguiente</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}