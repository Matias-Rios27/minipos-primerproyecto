"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. SINCRONIZACIÓN Y PERMANENCIA
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

  // PALETA DINÁMICA
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

  const products = [
    { id: 1, name: "Coca cola 3L", category: "Bebidas", price: 1800, cost: 1500, stock: 45, provider: "TAL TAL" },
    { id: 2, name: "Papas Fritas XL", category: "Alimentos", price: 2500, cost: 1800, stock: 12, provider: "Evercrisp" },
    { id: 3, name: "Detergente 3kg", category: "Limpieza", price: 8900, cost: 6200, stock: 5, provider: "Unilever" },
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
            <h1 className="text-lg font-bold" style={{ color: isDark ? "#FFF" : "#1E293B" }}>Gestión de Inventario</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            {products.length} Productos registrados • Sucursal Quilicura
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden md:flex p-1 rounded-xl mr-4 border ${
            isMounted ? "transition-colors duration-500" : "transition-none"
          }`} style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button onClick={() => router.push("/historial")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Historial</button>
            <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Inventario</button>
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
          
          {/* BARRA DE ACCIONES */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Buscar por nombre, SKU o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full border rounded-2xl py-4 px-14 outline-none text-sm font-medium ${
                    isMounted ? "transition-all duration-500" : ""
                }`}
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
              />
              <span className="absolute left-5 top-4.5 opacity-30 text-xl">🔍</span>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => router.push("/listaproveedores")}
                className="flex-1 md:flex-none border px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
              >
                📞 Proveedores
              </button>
              <button 
                onClick={() => router.push("/agregarproducto")}
                className="flex-1 md:flex-none bg-[#1E3A5F] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <span>➕</span> Nuevo Producto
              </button>
            </div>
          </div>

          {/* TABLA DE PRODUCTOS */}
          <div 
            className={`rounded-3xl border shadow-xl overflow-hidden ${
                isMounted ? "transition-colors duration-500" : "transition-none"
            }`}
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: theme.subtle }} className={isMounted ? "transition-colors duration-500" : ""}>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Producto</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Categoría</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textMuted }}>Stock</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textMuted }}>Costo</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textMuted }}>Precio Venta</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Proveedor</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: theme.textMuted }}>Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isMounted ? "transition-colors duration-500" : ""}`} style={{ borderColor: theme.border }}>
                <AnimatePresence>
                  {products.map((p) => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`transition-colors group ${theme.tableRow}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center border p-1 group-hover:scale-105 transition-transform" style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
                            <span className="text-xl">📦</span>
                          </div>
                          <span className="font-bold text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-black text-sm ${p.stock <= 10 ? 'text-rose-500' : ''}`}>
                          {p.stock} un.
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium" style={{ color: theme.textMuted }}>
                        ${p.cost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center font-black text-base">
                        ${p.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: theme.textMuted }}>{p.provider}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => router.push("/editarproducto")}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-90"
                            style={isDark ? {backgroundColor: "#1F2937", borderColor: "#374151"} : {}}
                          >✏️</button>
                          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-rose-500 hover:bg-rose-50 transition-all shadow-sm active:scale-90"
                            style={isDark ? {backgroundColor: "#1F2937", borderColor: "#374151"} : {}}
                          >🗑️</button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* FOOTER INVENTARIO */}
          <div className="mt-6 flex justify-between items-center px-4">
            <div className="flex items-center gap-4 text-xs font-bold" style={{ color: theme.textMuted }}>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-rose-500 rounded-full"></span> Stock Bajo
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Stock OK
                </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-xl text-xs font-bold transition-all active:scale-95" style={{ backgroundColor: theme.card, borderColor: theme.border }}>Anterior</button>
              <button className="px-4 py-2 border rounded-xl text-xs font-bold transition-all active:scale-95" style={{ backgroundColor: theme.card, borderColor: theme.border }}>Siguiente</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}