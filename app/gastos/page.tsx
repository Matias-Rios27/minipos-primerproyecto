"use client";

import { useState, useEffect, useRef } from "react"; // Añadido useRef
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function GestionGastosPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("Usuario");
  // ESTADOS PARA NOTIFICACIONES (Siguiendo tu estilo previo)
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [alertas, setAlertas] = useState([
    { id: 1, mensaje: "Stock Crítico: Coca-Cola Sin Azúcar", tipo: "stock" },
    { id: 2, mensaje: "Gasto Pendiente: Pago Arriendo vence mañana", tipo: "gasto" },
  ]);

  // 1. SINCRONIZACIÓN DE TEMA Y MONTAJE
  useEffect(() => {
    const storedUser = localStorage.getItem("user_name") || "Admin"; 
    setUserName(storedUser);    

    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    const timer = setTimeout(() => setIsMounted(true), 100);

    // Cerrar al hacer clic fuera
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

  const gastos = [
    { id: 1, categoria: "Servicios", desc: "Cuenta de Agua - Enero", fecha: "2026-01-14", monto: 54482, estado: "Pagado" },
    { id: 2, categoria: "Abastecimiento", desc: "Proveedor Bebidas S.A.", fecha: "2026-02-01", monto: 210500, estado: "Pendiente" },
    { id: 3, categoria: "Logística", desc: "Mantenimiento Camión", fecha: "2026-02-02", monto: 85000, estado: "Pagado" },
  ];

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
            <h1 className="text-lg font-bold">Gestión de Gastos</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            Control de Egresos • Sucursal Quilicura
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

          <div className="flex items-center gap-2 relative" ref={notifRef}>
            <button onClick={toggleDarkMode} className="p-2.5 rounded-xl border transition-all text-lg shadow-sm active:scale-90" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              {isDark ? "☀️" : "🌙"}
            </button>
            
            {/* BOTÓN DE NOTIFICACIONES */}
            <button 
              onClick={() => setShowNotificaciones(!showNotificaciones)}
              className="p-2.5 rounded-xl border transition-all relative active:scale-90" 
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <span className="text-lg italic">🔔</span>
              {alertas.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-[#111827]">
                  {alertas.length}
                </span>
              )}
            </button>

            {/* PANEL DE NOTIFICACIONES (DENTRO DEL DROPDOWN) */}
            <AnimatePresence>
              {showNotificaciones && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-3xl border shadow-2xl z-50 overflow-hidden"
                  style={{ backgroundColor: theme.card, borderColor: theme.border }}
                >
                  <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: theme.border, backgroundColor: theme.subtle }}>
                    <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: theme.text }}>Alertas Recientes</h3>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] text-white font-bold">
                      {alertas.length} Avisos
                    </span>
                  </div>

                  <div className="max-h-[350px] overflow-y-auto">
                    {alertas.length > 0 ? (
                      alertas.map((alerta) => (
                        <div key={alerta.id} className="p-4 border-b last:border-0 hover:bg-slate-500/5 transition-colors" style={{ borderColor: theme.border }}>
                          <div className="flex gap-3">
                            <span className="text-lg">{alerta.tipo === 'stock' ? '📉' : '⚠️'}</span>
                            <div>
                              <p className="text-xs font-bold leading-tight" style={{ color: theme.text }}>{alerta.mensaje}</p>
                              <p className="text-[10px] opacity-50 mt-1 font-medium" style={{ color: theme.textMuted }}>Verificar ahora</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center opacity-40 text-xs font-bold" style={{ color: theme.text }}>
                        No hay alertas pendientes
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
            {userName.substring(0, 2).toUpperCase()}
          </div>        
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          
          {/* TÍTULO Y BUSCADOR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Registro de Gastos</h2>
              <p className="text-sm font-medium mt-1" style={{ color: theme.textMuted }}>Administración de categorías y egresos operativos</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-sm">🔍</span>
                <input 
                  type="text" 
                  placeholder="Buscar por categoría o descripción..." 
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
                  style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="bg-[#1E3A5F] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95">
                + Nuevo Gasto
              </button>
            </div>
          </div>

          {/* TABLA DE GASTOS */}
          <div className="rounded-[32px] border overflow-hidden shadow-sm transition-colors duration-500" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            <div className="grid grid-cols-12 px-8 py-5 border-b text-[10px] font-black uppercase tracking-[0.2em]" 
                 style={{ backgroundColor: isDark ? "#1F2937" : "#F1F5F9", borderColor: theme.border, color: theme.textMuted }}>
              <div className="col-span-2">Categoría</div>
              <div className="col-span-4">Descripción del Egreso</div>
              <div className="col-span-2 text-center">Fecha</div>
              <div className="col-span-2 text-center">Monto</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>

            <div className="divide-y" style={{ borderColor: theme.border }}>
              <AnimatePresence>
                {gastos.map((gasto, idx) => (
                  <motion.div 
                    key={gasto.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-500/5 transition-colors group"
                  >
                    <div className="col-span-2">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        gasto.categoria === "Servicios" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                      }`}>
                        {gasto.categoria}
                      </span>
                    </div>
                    <div className="col-span-4 font-bold text-sm tracking-tight">{gasto.desc}</div>
                    <div className="col-span-2 text-center text-xs font-medium opacity-60 italic">{gasto.fecha}</div>
                    <div className="col-span-2 text-center">
                      <span className="text-lg font-black tracking-tighter" style={{ color: isDark ? "#F87171" : "#E11D48" }}>
                        ${gasto.monto.toLocaleString()}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <button className="p-2 rounded-xl border hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                              style={{ borderColor: theme.border }}>
                        🗑️
                      </button>
                      <button className="px-4 py-2 bg-[#1E3A5F] text-white text-[10px] font-black uppercase rounded-xl hover:opacity-80 transition-all active:scale-90 shadow-md">
                        Ver Detalle
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* FOOTER RESUMEN */}
          <div className="mt-8 flex justify-end">
            <div className="p-8 rounded-[32px] border flex items-center gap-10" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Total Gastos Mes</p>
                <p className="text-3xl font-black italic tracking-tighter text-rose-500">$350.150</p>
              </div>
              <div className="h-12 w-px bg-slate-200" style={{ backgroundColor: theme.border }}></div>
              <button 
                onClick={() => router.push("/balance")}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-blue-500 transition-colors"
              >
                Analizar Balance <span>➜</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}