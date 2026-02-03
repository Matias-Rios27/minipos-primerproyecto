"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  activePage: "pos" | "history" | "inventory" | "providers" | "dashboard";
}

export default function Navbar({ activePage }: NavbarProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    setIsMounted(true);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
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
    header: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
    text: isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    subtle: isDark ? "#1F2937" : "#F1F5F9",
    card: isDark ? "#111827" : "#FFFFFF",
  };

  // Función para estilos de botones
  const getBtnStyle = (page: string) => {
    const isActive = activePage === page;
    if (isActive) {
      return isDark 
        ? "bg-slate-700 text-blue-400 shadow-sm" 
        : "bg-white text-blue-600 shadow-sm";
    }
    return "opacity-70 hover:opacity-100";
  };

  return (
    <header 
      className={`h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0 ${isMounted ? "transition-colors duration-500" : ""}`}
      style={{ backgroundColor: theme.header, borderColor: theme.border, color: theme.text }}
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
        <div className="hidden md:flex p-1 rounded-xl mr-4 border" 
             style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
          <button onClick={() => router.push("/Main")} className={`px-4 py-2 text-xs font-bold transition-all rounded-lg ${getBtnStyle("pos")}`}>Punto de Venta</button>
          <button onClick={() => router.push("/historial")} className={`px-4 py-2 text-xs font-bold transition-all rounded-lg ${getBtnStyle("history")}`}>Historial</button>
          <button onClick={() => router.push("/inventario")} className={`px-4 py-2 text-xs font-bold transition-all rounded-lg ${getBtnStyle("inventory")}`}>Inventario</button>
          <button onClick={() => router.push("/proveedores")} className={`px-4 py-2 text-xs font-bold transition-all rounded-lg ${getBtnStyle("providers")}`}>Proveedores</button>
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
  );
}