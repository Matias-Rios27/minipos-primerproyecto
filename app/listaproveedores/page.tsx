"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProvidersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. SINCRONIZACIÓN Y PERMANENCIA (Igual a Inventario)
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

  const providers = [
    { id: 1, name: "TAL TAL", contact: "Juan Pérez", phone: "+56 9 1234 5678", email: "ventas@taltal.cl", category: "Bebidas", rating: 4.8 },
    { id: 2, name: "Evercrisp", contact: "María Soto", phone: "+56 2 2837 4000", email: "pedidos@evercrisp.cl", category: "Snacks", rating: 4.5 },
    { id: 3, name: "Unilever", contact: "Ricardo Lagos", phone: "+56 2 2700 1122", email: "soporte@unilever.com", category: "Limpieza", rating: 4.9 },
    { id: 4, name: "CCU Chile", contact: "Ana Dornell", phone: "+56 9 8877 6655", email: "contacto@ccu.cl", category: "Bebidas", rating: 4.2 },
  ];

  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER SUPERIOR (Mismo que Inventario) */}
      <header 
        className={`h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0 ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
        style={{ backgroundColor: theme.header, borderColor: theme.border }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">MP</div>
            <h1 className="text-lg font-bold">Directorio de Proveedores</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {providers.length} Proveedores activos • Red de suministros
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden md:flex p-1 rounded-xl mr-4 border ${isMounted ? "transition-colors duration-500" : ""}`} style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button onClick={() => router.push("/historial")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Historial</button>
            <button onClick={() => router.push("/Inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
            <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Proveedores</button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl border transition-all text-lg shadow-sm hover:scale-105" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              {isDark ? "☀️" : "🌙"}
            </button>
            <button className="p-2.5 rounded-xl border transition-all relative" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <span className="text-lg italic">🔔</span>
            </button>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">MT</div>
        </div>
      </header>

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
                className="w-full border rounded-2xl py-4 px-14 outline-none text-sm font-medium"
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
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Contacto Directo</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Categoría</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textMuted }}>Teléfono</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textMuted }}>Email</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: theme.textMuted }}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: theme.border }}>
                <AnimatePresence>
                  {providers.map((p) => (
                    <motion.tr 
                      key={p.id}
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
                            <p className="font-bold text-sm">{p.name}</p>
                            <p className="text-[10px] font-bold text-emerald-500">⭐ {p.rating} / 5.0</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-sm">{p.contact}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold" style={{ color: theme.textMuted }}>
                        {p.phone}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium" style={{ color: theme.textMuted }}>
                        {p.email}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-blue-600 hover:bg-blue-50 shadow-sm active:scale-90" style={isDark ? {backgroundColor: "#1F2937", borderColor: "#374151"} : {}}>📞</button>
                          <button onClick={() => router.push("/editarproveedor")} className="p-2.5 bg-white border border-slate-200 rounded-xl text-blue-600 hover:bg-blue-50 shadow-sm active:scale-90" style={isDark ? {backgroundColor: "#1F2937", borderColor: "#374151"} : {}}>✏️</button>
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