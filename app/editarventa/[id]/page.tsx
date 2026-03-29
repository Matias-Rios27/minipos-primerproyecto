"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getVentaDetalles, updateVenta } from "@/lib/api"; // Tu API
import { Venta, DetalleVenta } from "@/types/types"; // Tus Types

export default function EditarVentaPage() {
  const router = useRouter();
  const { id } = useParams(); // Obtiene el ID de la URL
  
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  
  // ESTADOS PARA DATOS REALES
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [venta, setVenta] = useState<Venta | null>(null);
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);

  // 1. SINCRONIZACIÓN Y CARGA DE DATOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVentaDetalles(id as string);
        if (data) {
          setVenta(data);
          setDetalles(data.detalles || []);
        }
      } catch (error) {
        console.error("Error cargando venta", error);
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem("user_name") || "Admin"; 
    setUserName(storedUser);
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    const timer = setTimeout(() => setIsMounted(true), 100);

    if (id) fetchData();

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [id]);

  // 2. FUNCIONES DE HABILITACIÓN (Edición)
  const handleCantidadChange = (detalleId: number, nuevaCant: number) => {
    setDetalles(prev => prev.map(item => 
      item.detalle_id === detalleId ? { ...item, cantidad: nuevaCant, subtotal: nuevaCant * item.precio_unitario } : item
    ));
  };

  const handleRemove = (detalleId: number) => {
    setDetalles(prev => prev.filter(item => item.detalle_id !== detalleId));
  };

  const totalCalculado = detalles.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);

  const onGuardar = async () => {
    try {
      setIsSaving(true);
      await updateVenta(id as string, {
        ...venta,
        total: totalCalculado,
        items: detalles
      });
      setShowSuccess(true);
    } catch (error) {
      alert("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

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

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase tracking-tighter" style={{backgroundColor: theme.bg, color: theme.text}}>Cargando Registro...</div>;

  return (
    <div 
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      
      {/* HEADER ORIGINAL */}
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
                <h2 className="text-5xl font-black italic tracking-tighter mb-8">#{id}</h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[9px] font-black uppercase text-blue-300/50 mb-1">Total Actualizado</p>
                    <span className="text-xl font-black">${new Intl.NumberFormat("es-CL").format(totalCalculado)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-3">
                <button 
                  onClick={onGuardar}
                  disabled={isSaving}
                  className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? "Guardando..." : "💾 Guardar Cambios"}
                </button>
              </div>
            </div>

            {/* CENTRO: FORMULARIO EDITABLE */}
            <div className="flex-1 p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <label className={labelStyle} style={{ color: theme.textMuted }}>Fecha Venta</label>
                  <input type="date" value={venta?.fecha_venta ? venta.fecha_venta.split('T')[0] : ""}
                    onChange={(e) => setVenta(v => v ? {...v, fecha_venta: e.target.value} : null)}
                    className={inputStyle} 
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
                <AnimatePresence>
                  {detalles.map((item) => (
                    <motion.div 
                      key={item.detalle_id} 
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 p-4 rounded-2xl border" 
                      style={{ borderColor: theme.border, backgroundColor: theme.subtle }}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-black italic">{item.nombre_producto || "Producto"}</p>
                        <p className="text-[9px] font-bold opacity-50 uppercase">ID: {item.producto_id}</p>
                      </div>
                      <div className="w-20">
                        <p className="text-[8px] font-black opacity-40 uppercase">Cant.</p>
                        <input 
                          type="number" 
                          value={item.cantidad} 
                          onChange={(e) => handleCantidadChange(item.detalle_id, parseInt(e.target.value) || 0)}
                          className="w-full bg-transparent font-black outline-none border-b border-blue-500/20" 
                          style={{ color: theme.text }} 
                        />
                      </div>
                      <div className="w-24 text-right">
                        <p className="text-[8px] font-black opacity-40 uppercase">Precio Unit.</p>
                        <p className="font-black text-xs">${new Intl.NumberFormat("es-CL").format(item.precio_unitario)}</p>
                      </div>
                      <button onClick={() => handleRemove(item.detalle_id)} className="p-2 text-rose-500 opacity-50 hover:opacity-100">✕</button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MODAL DE ÉXITO (Habilitado) */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`max-w-sm w-full p-8 rounded-[40px] text-center shadow-2xl ${isDark ? "bg-slate-900 border border-emerald-500/30" : "bg-white"}`}>
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg shadow-emerald-500/40">✓</div>
              <h3 className="text-2xl font-black mb-2">¡Venta Actualizada!</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium text-pretty">Los cambios en el folio <b>#{id}</b> se han sincronizado con la base de datos.</p>
              <button onClick={() => router.push('/historial')} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all">
                Finalizar y Salir
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}