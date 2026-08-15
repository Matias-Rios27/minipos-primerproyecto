"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  deleteNotificacion,
  createProveedor
} from "@/lib/api";

import { Alerta } from "@/types/types";
import Navbar from "../components/Navbar";

export default function AgregarProveedorPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");

  // ESTADOS PARA NOTIFICACIONES
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    direccion: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. SINCRONIZACIÓN Y PERMANENCIA DEL TEMA + NOTIFICACIONES
  useEffect(() => {
    const storedUser = localStorage.getItem("user_name") || "Admin"; 
    setUserName(storedUser);

    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const timer = setTimeout(() => setIsMounted(true), 100);

    // Cerrar notificaciones al hacer clic fuera
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

  const inputClass = "w-full border rounded-2xl py-4 px-6 outline-none transition-all text-sm font-bold focus:ring-4 focus:ring-blue-500/10";
  const labelClass = "text-[10px] font-black uppercase ml-2 mb-2 block tracking-widest";

  
  const handleDeleteNotificacion = async (id: number) => {
    try {
      await deleteNotificacion(id);
      setAlertas(prev => prev.filter(a => a.notificacion_id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return alert("El nombre es obligatorio");
    
    setIsSubmitting(true);
    try {
      await createProveedor(formData);
      alert("Proveedor vinculado exitosamente");
      router.push("/listaproveedores");
    } catch (error) {
      console.error("Error al crear proveedor:", error);
      alert("Error al vincular el proveedor");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER UNIFICADO */}
      <Navbar activePage="providers" />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => router.back()} 
            className="mb-6 flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span> Volver al Listado
          </button>

          <div 
            className="rounded-3xl border shadow-2xl overflow-hidden" 
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <div className="p-8 border-b flex justify-between items-center" 
                 style={{ borderColor: theme.border, backgroundColor: theme.subtle }}>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Alta de Nuevo Proveedor</h2>
                <p className="text-xs font-bold opacity-50 uppercase">Módulo de Suministros y Logística</p>
              </div>
              <div className="flex items-center gap-3 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-xl border border-blue-500/20">
                <span className="text-[10px] font-black uppercase">Validación de RUT pendiente</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-8">
              
              {/* CAMPOS DE DATOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: theme.textMuted }}>Razón Social / Nombre Empresa</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="EJ: DISTRIBUIDORA DE BEBIDAS SPA" 
                    className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} 
                  />
                </div>


                <div>
                  <label className={labelClass} style={{ color: theme.textMuted }}>Teléfono de Pedidos</label>
                  <input 
                    type="tel" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+56 9 ..." 
                    className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: theme.textMuted }}>Correo Electrónico para Facturación</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ventas@proveedor.cl" 
                    className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} style={{ color: theme.textMuted }}>Dirección de Despacho / Oficina</label>
                  <input 
                    type="text" 
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Av. Principal 123, Santiago" 
                    className={inputClass}
                    style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} 
                  />
                </div>

              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="pt-6 mt-6 border-t flex gap-4" style={{ borderColor: theme.border }}>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? "Vinculando..." : "🤝 Vincular Nuevo Proveedor"}
                </button>
                <button 
                  type="reset" 
                  onClick={() => setFormData({ nombre: "", telefono: "", email: "", direccion: "" })}
                  className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border transition-all active:scale-95"
                  style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.textMuted }}
                >
                  Limpiar Formulario
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}