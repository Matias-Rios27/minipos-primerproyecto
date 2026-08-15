"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getNotificaciones, deleteNotificacion } from "@/lib/api";
import { Alerta } from "@/types/types";

export type ActivePageType =
  | "pos"
  | "inventory"
  | "history"
  | "dashboard"
  | "gastos"
  | "balance"
  | "users"
  | "providers";

interface NavbarProps {
  activePage?: ActivePageType;
}

export default function Navbar({ activePage }: NavbarProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined"
        ? localStorage.getItem("user_name") || sessionStorage.getItem("user_name") || "Admin"
        : "Admin";
    setUserName(storedUser);

    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    setIsMounted(true);

    const loadAlerts = async () => {
      try {
        const notifyData = await getNotificaciones();
        setAlertas(notifyData || []);
      } catch (e) {
        console.error("Error cargando notificaciones", e);
      }
    };
    loadAlerts();

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

  const handleDeleteNotificacion = async (id: number) => {
    try {
      await deleteNotificacion(id);
      setAlertas((prev) => prev.filter((a) => a.notificacion_id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  const theme = {
    header: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
    text: isDark ? "#F8FAFC" : "#0F172A",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    subtle: isDark ? "#1E293B" : "#F1F5F9",
    card: isDark ? "#111827" : "#FFFFFF",
  };

  const navItems = [
    { id: "pos", label: "Punto de Venta", path: "/Main" },
    { id: "inventory", label: "Inventario", path: "/inventario" },
    { id: "history", label: "Historial", path: "/historial" },
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "gastos", label: "Gastos", path: "/gastos" },
    { id: "balance", label: "Balance", path: "/balance" },
    { id: "users", label: "Usuarios", path: "/usuarios" },
    { id: "providers", label: "Proveedores", path: "/listaproveedores" },
  ];

  return (
    <header
      className={`h-20 backdrop-blur-md border-b px-6 flex justify-between items-center z-30 shrink-0 ${
        isMounted ? "transition-colors duration-300" : ""
      }`}
      style={{ backgroundColor: theme.header, borderColor: theme.border, color: theme.text }}
    >
      {/* Identidad / Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/Main")}>
        <div className="w-9 h-9 rounded-xl bg-[#1E3A5F] text-white flex items-center justify-center font-black text-sm shadow-md">
          MP
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight flex items-center gap-1.5 leading-none">
            MiniPOS <span className="text-blue-500 font-semibold">MTZ</span>
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold mt-1" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Quilicura Online
          </div>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl border shadow-xs" style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-[#1E3A5F] text-white shadow-sm font-black"
                  : "opacity-70 hover:opacity-100 hover:bg-slate-500/10"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Acciones del Sistema */}
      <div className="flex items-center gap-3">
        {/* Toggle Modo Oscuro SVG */}
        <button
          onClick={toggleDarkMode}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="p-2.5 rounded-xl border transition-all shadow-xs active:scale-90 hover:bg-slate-500/10"
          style={{ backgroundColor: theme.card, borderColor: theme.border }}
        >
          {isDark ? (
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Notificaciones SVG */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotificaciones(!showNotificaciones)}
            className="p-2.5 rounded-xl border transition-all relative active:scale-90 hover:bg-slate-500/10"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
            title="Notificaciones y alertas"
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {alertas.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
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
                className="absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: theme.border, backgroundColor: theme.subtle }}>
                  <h3 className="text-xs font-black uppercase tracking-wider">Alertas Recientes</h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] text-white font-bold">{alertas.length}</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {alertas.length > 0 ? (
                    alertas.map((alerta) => (
                      <div key={alerta.notificacion_id} className="p-3.5 border-b last:border-0 hover:bg-slate-500/5 transition-colors" style={{ borderColor: theme.border }}>
                        <div className="flex gap-3 text-xs items-center justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-slate-800 dark:text-slate-200">{alerta.mensaje}</p>
                            <p className="text-[10px] opacity-50 mt-0.5 font-semibold">Alerta del sistema</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotificacion(alerta.notificacion_id);
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center opacity-40 text-xs font-bold uppercase tracking-wider">
                      Sin alertas pendientes
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar Usuario */}
        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs border border-blue-200 dark:border-slate-700 shadow-xs">
          {userName.substring(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}