"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AgregarProductoPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showNotificaciones, setShowNotificaciones] = useState(false);

  // 1. SINCRONIZACIÓN Y PERMANENCIA DEL TEMA
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
      className={`flex flex-col h-screen font-sans overflow-hidden ${
        isMounted ? "transition-colors duration-500" : "transition-none"
      }`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER UNIFICADO */}
      <header 
        className={`h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0 ${
          isMounted ? "transition-colors duration-500" : "transition-none"
        }`}
        style={{ backgroundColor: theme.header, borderColor: theme.border }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">MP</div>
            <h1 className="text-lg font-bold">Gestión de Inventario</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Nuevo Registro Maestro • productos
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden md:flex p-1 rounded-xl mr-4 border ${isMounted ? "transition-colors" : ""}`} 
               style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
            <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Nuevo Producto</button>
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Dashboard</button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl border transition-all text-lg shadow-sm active:scale-90" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
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
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => router.back()} 
            className="mb-6 flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span> Cancelar y Volver
          </button>

          <div 
            className={`rounded-3xl border shadow-2xl overflow-hidden ${isMounted ? "transition-colors duration-500" : ""}`} 
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <div className={`p-8 border-b flex justify-between items-center ${isMounted ? "transition-colors duration-500" : ""}`} 
                 style={{ borderColor: theme.border, backgroundColor: theme.subtle }}>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Ficha Técnica de Producto</h2>
                <p className="text-xs font-bold opacity-50 uppercase">Vinculación: Table productos x Table proveedores</p>
              </div>
              <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] font-black uppercase">Estado: Activo</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>

            <form className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* ZONA DE CARGA DE IMAGEN */}
              <div className="md:col-span-1 flex flex-col gap-4">
                <label className={labelClass} style={{ color: theme.textMuted }}>Imagen del Producto</label>
                <div 
                  className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all hover:border-blue-500/50 group cursor-pointer ${isMounted ? "transition-colors" : ""}`}
                  style={{ borderColor: theme.border, backgroundColor: theme.subtle }}
                >
                  <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">📸</span>
                  <p className="text-[10px] font-black uppercase text-center opacity-40 px-4">Arrastra o selecciona la imagen del producto</p>
                </div>
                <button type="button" className="w-full py-3 bg-blue-600 text-white text-[10px] font-black uppercase text-center rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                  Cargar Imagen
                </button>
              </div>

              {/* CAMPOS DE DATOS */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: theme.textMuted }}>Nombre Comercial</label>
                  <input type="text" placeholder="EJ: COCA COLA ORIGINAL 1.5L" className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                </div>

                <div>
                  <label className={labelClass} style={{ color: theme.textMuted }}>Proveedor (Relación)</label>
                  <select className={inputClass} style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }}>
                    <option>Seleccionar proveedor...</option>
                    <option>TAL TAL S.A.</option>
                    <option>EVERCRISP</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass} style={{ color: theme.textMuted }}>Precio Venta ($)</label>
                  <input type="number" placeholder="0" className={`${inputClass} text-blue-500`}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border }} />
                </div>

                <div>
                  <label className={labelClass} style={{ color: theme.textMuted }}>Stock Inicial</label>
                  <input type="number" placeholder="0" className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                </div>

                <div>
                  <label className={labelClass} style={{ color: theme.textMuted }}>Stock Mínimo (Alerta)</label>
                  <input type="number" placeholder="Ej: 10" className={`${inputClass} text-rose-500`}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border }} />
                </div>

                <div className="md:col-span-2 flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed mt-2" style={{ borderColor: theme.border }}>
                   <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg accent-blue-600" id="prod-activo" />
                   <label htmlFor="prod-activo" className="text-[10px] font-black uppercase cursor-pointer opacity-70">
                     Habilitar inmediatamente para la venta en el POS
                   </label>
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className={`md:col-span-3 pt-6 mt-6 border-t flex gap-4 ${isMounted ? "border-t transition-colors" : ""}`} style={{ borderColor: theme.border }}>
                <button type="submit" className="flex-1 bg-[#1E3A5F] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]">
                  💾 Guardar en Base de Datos
                </button>
                <button type="reset" className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border transition-all active:scale-95"
                  style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.textMuted }}>
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}