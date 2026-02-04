"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function EditarVentaPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");
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
    input: isDark ? "#1F2937" : "#F1F5F9",
  };

  const labelStyle = "text-[10px] font-black uppercase tracking-[0.15em] mb-2 block opacity-60";
  const inputStyle = `w-full p-4 rounded-2xl border outline-none font-bold text-sm transition-all focus:ring-4 focus:ring-blue-500/10`;

  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* EL NAVBAR ORIGINAL QUE ME DISTE */}
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
            <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Editar Venta</button>
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
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
            {userName.substring(0, 2).toUpperCase()}
          </div>        
        </div>
      </header>

      {/* CONTENIDO DE EDICIÓN */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">
            <span className="p-2 rounded-lg border" style={{ backgroundColor: theme.card, borderColor: theme.border }}>←</span> 
            Cancelar y Volver
          </button>

          <div className="rounded-[32px] border shadow-2xl overflow-hidden flex flex-col lg:flex-row" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            
            {/* IZQUIERDA: RESUMEN FIJO */}
            <div className="w-full lg:w-72 bg-[#1E3A5F] p-8 text-white flex flex-col justify-between">
              <div>
                <p className={labelStyle} style={{ color: "rgba(147, 197, 253, 0.4)" }}>Folio en Edición</p>
                <h2 className="text-5xl font-black italic tracking-tighter mb-8">#001</h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[9px] font-black uppercase text-blue-300/50 mb-1">Tipo de Documento</p>
                    <span className="text-xs font-bold">Boleta Electrónica</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-3">
                <button className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all shadow-lg active:scale-95">
                  💾 Guardar Cambios
                </button>
                <button className="w-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                  Eliminar Registro
                </button>
              </div>
            </div>

            {/* CENTRO: FORMULARIO EDITABLE */}
            <div className="flex-1 p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <label className={labelStyle} style={{ color: theme.textMuted }}>Fecha Venta</label>
                  <input type="date" defaultValue="2026-02-13" className={inputStyle} 
                    style={{ backgroundColor: theme.input, borderColor: theme.border, color: theme.text }} />
                </div>
                <div>
                  <label className={labelStyle} style={{ color: theme.textMuted }}>Método de Pago</label>
                  <select className={inputStyle} style={{ backgroundColor: theme.input, borderColor: theme.border, color: theme.text }}>
                    <option>Efectivo</option>
                    <option>Débito</option>
                    <option>Transferencia</option>
                  </select>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest mb-6 pb-2 border-b" style={{ borderColor: theme.border, color: theme.textMuted }}>
                Artículos del Folio
              </h3>

              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ borderColor: theme.border, backgroundColor: theme.subtle }}>
                    <div className="flex-1">
                      <p className="text-sm font-black italic">Producto Ejemplo {i}</p>
                      <p className="text-[9px] font-bold opacity-50 uppercase">Categoría General</p>
                    </div>
                    <div className="w-20">
                      <p className="text-[8px] font-black opacity-40 uppercase">Cant.</p>
                      <input type="number" defaultValue="1" className="w-full bg-transparent font-black outline-none" style={{ color: theme.text }} />
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-[8px] font-black opacity-40 uppercase">Precio</p>
                      <input type="text" defaultValue="$1.000" className="w-full bg-transparent font-black text-right outline-none" style={{ color: theme.text }} />
                    </div>
                    <button className="p-2 text-rose-500 opacity-50 hover:opacity-100">✕</button>
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