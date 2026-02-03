"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BalancePage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
            <h1 className="text-lg font-bold">Balance Financiero</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Periodo Fiscal 2026 • Sucursal Quilicura
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden md:flex p-1 rounded-xl mr-4 border ${isMounted ? "transition-colors" : ""}`} 
               style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button onClick={() => router.push("/historial")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Historial</button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
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

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Estado de Resultados</h2>
              <p className="text-sm font-medium mt-1" style={{ color: theme.textMuted }}>Cierre de mes: Febrero 2026</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] border rounded-2xl transition-all shadow-sm flex items-center gap-2 active:scale-95"
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}>
                📄 Exportar PDF
              </button>
              <button className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] bg-[#1E3A5F] text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                📊 Descargar Excel
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* INGRESOS (Ref: ingresos) */}
            <div className={`p-8 rounded-[32px] border-t-8 border-emerald-500 shadow-xl transition-colors duration-500`} style={{ backgroundColor: theme.card }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: theme.textMuted }}>Ingresos Brutos</p>
              <h3 className="text-4xl font-black tracking-tighter italic text-emerald-600">+$5.400.000</h3>
              <div className="mt-6 flex items-center gap-2 text-emerald-500 font-bold text-xs px-3 py-1.5 rounded-full w-fit" style={{ backgroundColor: isDark ? "#064E3B" : "#ECFDF5" }}>
                <span>↑ 12%</span>
                <span className="opacity-60 font-medium">vs mes anterior</span>
              </div>
            </div>

            {/* EGRESOS (Ref: gastos) */}
            <div className={`p-8 rounded-[32px] border-t-8 border-rose-500 shadow-xl transition-colors duration-500`} style={{ backgroundColor: theme.card }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: theme.textMuted }}>Egresos Totales</p>
              <h3 className="text-4xl font-black tracking-tighter italic text-rose-500">-$1.240.500</h3>
              <div className="mt-6 flex items-center gap-2 text-rose-500 font-bold text-xs px-3 py-1.5 rounded-full w-fit" style={{ backgroundColor: isDark ? "#451A03" : "#FFF1F2" }}>
                <span>↓ 5%</span>
                <span className="opacity-60 font-medium">Optimización</span>
              </div>
            </div>

            {/* UTILIDAD */}
            <div className="bg-[#1E3A5F] p-8 rounded-[32px] shadow-2xl text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-blue-300/60 tracking-widest mb-1">Utilidad Neta</p>
                <h3 className="text-4xl font-black tracking-tighter italic text-emerald-400">$4.159.500</h3>
                <div className="mt-6">
                   <div className="flex justify-between text-[10px] font-black uppercase mb-1.5 text-white/40">
                     <span>Margen de Ganancia</span>
                     <span>77%</span>
                   </div>
                   <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: isMounted ? "77%" : 0 }} 
                        transition={{ duration: 1.5, ease: "easeOut" }} 
                        className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]" 
                      />
                   </div>
                </div>
              </div>
              <span className="absolute -right-6 -bottom-6 text-9xl opacity-5 font-black italic select-none">Σ</span>
            </div>
          </div>

          {/* GRÁFICO COMPARATIVO */}
          <div className="p-10 rounded-[40px] border shadow-sm mb-10 transition-colors duration-500" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="flex justify-between items-center mb-12">
              <h4 className="font-black uppercase text-[10px] tracking-[0.3em]">Histórico de Solvencia</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-black uppercase" style={{ color: theme.textMuted }}>Ingresos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className="text-[10px] font-black uppercase" style={{ color: theme.textMuted }}>Gastos</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-10 max-w-5xl mx-auto">
              {[
                { mes: "Enero 2026", ing: 85, egr: 15, total: "$5.4M" },
                { mes: "Diciembre 2025", ing: 70, egr: 30, total: "$4.1M" },
                { mes: "Noviembre 2025", ing: 60, egr: 40, total: "$3.8M" },
              ].map((data, idx) => (
                <div key={idx} className="flex items-center gap-8 group">
                  <span className="text-[10px] font-black w-32 uppercase transition-colors" style={{ color: theme.textMuted }}>{data.mes}</span>
                  <div className="flex-1 h-10 flex gap-1.5 items-center">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: isMounted ? `${data.ing}%` : 0 }} 
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="bg-emerald-500 h-full rounded-2xl shadow-lg flex items-center justify-center overflow-hidden"
                    >
                      {data.ing > 20 && <span className="text-[8px] font-black text-white">{data.ing}%</span>}
                    </motion.div>
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: isMounted ? `${data.egr}%` : 0 }} 
                      transition={{ duration: 1, delay: (idx * 0.1) + 0.3 }}
                      className="bg-rose-500 h-full rounded-2xl shadow-lg flex items-center justify-center overflow-hidden"
                    >
                      {data.egr > 20 && <span className="text-[8px] font-black text-white">{data.egr}%</span>}
                    </motion.div>
                  </div>
                  <span className="text-sm font-black w-20 text-right italic" style={{ color: theme.text }}>{data.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
            {/* CLASIFICACIÓN (Ref: categoria_gasto) */}
            <div className="p-8 rounded-[32px] border shadow-sm transition-colors duration-500" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 pb-5 border-b flex items-center gap-2" style={{ color: "#60A5FA", borderColor: theme.border }}>
                <span>📋</span> Distribución de Egresos
              </h5>
              <div className="space-y-6">
                <div className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl border" style={{ backgroundColor: isDark ? "#431407" : "#FFF7ED", borderColor: isDark ? "#7C2D12" : "#FFEDD5" }}>🚚</div>
                    <div>
                      <p className="text-sm font-black">Abastecimiento</p>
                      <p className="text-[10px] font-bold italic" style={{ color: theme.textMuted }}>Mercadería y fletes</p>
                    </div>
                  </div>
                  <div className="text-right font-black">
                    <p className="text-sm">$980.500</p>
                    <p className="text-[9px] text-orange-500 uppercase">79% del Gasto</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl border" style={{ backgroundColor: isDark ? "#172554" : "#EFF6FF", borderColor: isDark ? "#1E3A8A" : "#DBEAFE" }}>🏠</div>
                    <div>
                      <p className="text-sm font-black">Servicios</p>
                      <p className="text-[10px] font-bold italic" style={{ color: theme.textMuted }}>Luz, Agua e Internet</p>
                    </div>
                  </div>
                  <div className="text-right font-black">
                    <p className="text-sm">$260.000</p>
                    <p className="text-[9px] text-blue-500 uppercase">21% del Gasto</p>
                  </div>
                </div>
              </div>
            </div>

            {/* INSIGHT CARD */}
            <motion.div whileHover={{ y: -5 }} className="bg-[#1E3A5F] p-10 rounded-[32px] shadow-2xl flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-400/20 rounded-full flex items-center justify-center mb-6 mx-auto border border-emerald-400/30">
                  <span className="text-2xl">💡</span>
                </div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Recomendación Estratégica</p>
                <p className="text-lg font-medium text-white/90 leading-relaxed italic px-4">
                  "Tu margen actual del <span className="text-emerald-400 font-black">77%</span> es excepcional. Es el momento ideal para negociar compras por volumen con proveedores."
                </p>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}