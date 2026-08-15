"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getNotificaciones, deleteNotificacion, getProveedores } from "@/lib/api";
import { Alerta, Proveedor } from "@/types/types";
import Navbar from "../components/Navbar";

export default function ProvidersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  // Estados para notificaciones
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [providers, setProviders] = useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. SINCRONIZACIÓN Y PERMANENCIA DEL TEMA
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

    // Carga de notificaciones reales
    const loadAlerts = async () => {
      try {
        const data = await getNotificaciones();
        setAlertas(data || []);
      } catch (e) {
        console.error("Error cargando alertas", e);
      }
    };

    const loadProviders = async () => {
      try {
        const data = await getProveedores();
        setProviders(data || []);
      } catch (e) {
        console.error("Error cargando proveedores", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
    loadProviders();

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

  // PALETA DINÁMICA CORPORATIVA
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


  // Filtrado de búsqueda
  const filteredProviders = providers.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  
  const handleDeleteNotificacion = async (id: number) => {
    try {
      await deleteNotificacion(id);
      setAlertas(prev => prev.filter(a => a.notificacion_id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };



  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER SUPERIOR */}
      <Navbar activePage="providers" />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* BARRA DE ACCIONES */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Buscar proveedor por nombre, categoría o contacto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded-2xl py-4 px-14 outline-none text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500/20"
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
              />
              <span className="absolute left-5 top-4.5 opacity-30 text-xl">🔍</span>
            </div>
            
            <button 
              onClick={() => router.push("/agregarproveedor")}
              className="bg-[#1E3A5F] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 w-full md:w-auto"
            >
              <span>🤝</span> Nuevo Proveedor
            </button>
          </div>

          {/* TABLA DE PROVEEDORES */}
          <div 
            className="rounded-3xl border shadow-xl overflow-hidden"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: theme.subtle }}>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Empresa</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Dirección</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textMuted }}>Teléfono</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textMuted }}>Email</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: theme.textMuted }}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: theme.border }}>
                <AnimatePresence>
                  {filteredProviders.map((p) => (
                    <motion.tr 
                      key={p.proveedor_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`transition-colors group ${theme.tableRow}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center border p-1 group-hover:scale-105 transition-transform" style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
                            <span className="text-xl">🏢</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm">{p.nombre}</p>
                            <p className="text-[10px] font-bold text-emerald-500">⭐ 5.0 / 5.0</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-sm">{p.direccion || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold" style={{ color: theme.textMuted }}>
                        {p.telefono || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium" style={{ color: theme.textMuted }}>
                        {p.email}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-blue-600 hover:bg-blue-50 shadow-sm active:scale-90" style={isDark ? {backgroundColor: "#1F2937", borderColor: "#374151"} : {}}>📞</button>
                          <button onClick={() => router.push(`/editarproveedor/${p.proveedor_id}`)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-blue-600 hover:bg-blue-50 shadow-sm active:scale-90" style={isDark ? {backgroundColor: "#1F2937", borderColor: "#374151"} : {}}>✏️</button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ESTADÍSTICAS RÁPIDAS ABAJO */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border flex items-center gap-5" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">📦</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.textMuted }}>Pedidos Pendientes</p>
                <p className="text-2xl font-black">08</p>
              </div>
            </div>
            <div className="p-6 rounded-3xl border flex items-center gap-5" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">💰</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.textMuted }}>Cuentas por Pagar</p>
                <p className="text-2xl font-black">$1.240.000</p>
              </div>
            </div>
            <div className="p-6 rounded-3xl border flex items-center gap-5" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl">🚛</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.textMuted }}>Entregas Hoy</p>
                <p className="text-2xl font-black">03</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}