"use client";

import { useState, useEffect, useMemo } from "react";
// 1. Importamos useParams para obtener el ID de la URL
import { useRouter, useParams } from "next/navigation";
import { getNotificaciones, deleteNotificacion, getVentaDetalles, deleteVenta } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Alerta } from "@/types/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "@/app/components/Navbar";

export default function DetalleVentaPage() {
  const router = useRouter();
  const params = useParams();
  const idVenta = params.id;

  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [user_name, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("user_name") ||
        sessionStorage.getItem("user_name") ||
        "Usuario"
      );
    }
    return "Usuario";
  });
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [ventaInfo, setVentaInfo] = useState<any>(null);
  const [detalles, setDetalles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const totalVenta = useMemo(() => {
    return detalles.reduce(
      (acc, item) => acc + (Number(item.subtotal) || 0),
      0,
    );
  }, [detalles]);

const handleAnularVenta = async () => {
  // 1. Verificación de seguridad para TypeScript
  if (!idVenta) {
    alert("Error: No se pudo identificar el ID de la venta.");
    return;
  }

  const confirmar = window.confirm(`¿Estás seguro de que deseas ANULAR la venta #${idVenta}?`);

  if (confirmar) {
    try {
      setLoading(true);
      // Ahora TS sabe que idVenta NO es undefined aquí
      await deleteVenta(idVenta as string); 
      
      alert("Venta anulada con éxito.");
      router.push("/historial");
    } catch (error: any) {
      console.error("Error al anular:", error);
      alert("Error al anular la venta");
    } finally {
      setLoading(false);
    }
  }
};

  // Función para Exportar PDF de esta venta específica
  const exportarReciboPDF = () => {
    const doc = new jsPDF();
    const folio = idVenta?.toString().padStart(3, "0");

    doc.setFontSize(20);
    doc.text(`RECIBO DE VENTA #${folio}`, 14, 20);

    const tableRows = detalles.map((item) => [
      item.nombre_producto,
      item.cantidad,
      `$${Number(item.precio_unitario).toLocaleString("es-CL")}`,
      `$${Number(item.subtotal || item.cantidad * item.precio_unitario).toLocaleString("es-CL")}`,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Producto", "Cant.", "Precio Unit.", "Subtotal"]],
      body: tableRows,
      foot: [["", "", "TOTAL", `$${totalVenta.toLocaleString("es-CL")}`]],
      theme: "striped",
    });

    doc.save(`Venta_${folio}.pdf`);
  };

  // Función para Imprimir (abre diálogo de impresión del sistema)
  const imprimirRecibo = () => {
    window.print();
  };

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user_name") ||
      sessionStorage.getItem("user_name") ||
      "Admin";
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

    const loadData = async () => {
      if (!idVenta) return;
      try {
        setLoading(true);
        const data = await getVentaDetalles(Number(idVenta));

        if (data && data.detalles) {
          setVentaInfo(data);
          setDetalles(data.detalles);
        } else {
          setDetalles(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Error cargando detalles", e);
        setDetalles([]);
      } finally {
        setLoading(false);
      }
    };

    const loadAlerts = async () => {
      try {
        const data = await getNotificaciones();
        setAlertas(data || []);
      } catch (e) {
        console.error("Error cargando alertas", e);
      }
    };

    loadData();
    loadAlerts();

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [idVenta]);

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

  const theme = useMemo(
    () => ({
      bg: isDark ? "#0B1120" : "#F8FAFC",
      header: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
      card: isDark ? "#111827" : "#FFFFFF",
      text: isDark ? "#F1F5F9" : "#1E293B",
      textMuted: isDark ? "#94A3B8" : "#64748B",
      border: isDark ? "#1E293B" : "#E2E8F0",
      subtle: isDark ? "#1F2937" : "#F1F5F9",
    }),
    [isDark],
  );

  
  const handleDeleteNotificacion = async (id: number) => {
    try {
      await deleteNotificacion(id);
      setAlertas(prev => prev.filter(a => a.notificacion_id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };



  return (
    <div
      className={`flex flex-col h-screen font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : ""}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* HEADER SUPERIOR */}
      <Navbar activePage="history" />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {/* BOTÓN VOLVER Y ACCIONES */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 font-bold text-sm transition-colors hover:text-blue-500 group"
              style={{ color: theme.textMuted }}
            >
              <span
                className="p-2 rounded-lg border shadow-sm transition-transform group-hover:-translate-x-1"
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }}
              >
                ←
              </span>
              Volver al Historial
            </button>

            <div className="flex gap-3">
              <button
                onClick={exportarReciboPDF}
                className="flex items-center gap-2 px-5 py-2.5 border rounded-xl text-[10px] font-black transition-all shadow-sm active:scale-95"
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                }}
              >
                📥 EXPORTAR PDF
              </button>
              <button
                onClick={imprimirRecibo}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A5F] rounded-xl text-[10px] font-black text-white hover:bg-slate-800 transition-all shadow-lg tracking-widest active:scale-95"
              >
                🖨️ IMPRIMIR RECIBO
              </button>
            </div>
          </div>

          {/* TARJETA PRINCIPAL DE DETALLE */}
          <div
            className="rounded-[32px] border shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[550px]"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            {/* 1. INFO LATERAL (IZQUIERDA) */}
            <div className="w-full lg:w-80 bg-[#1E3A5F] p-10 flex flex-col justify-between text-white">
              <div className="space-y-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60 mb-2">
                    Folio de Venta
                  </p>
                  <h3 className="text-6xl font-black italic tracking-tighter">
                    #{idVenta?.toString().padStart(3, "0")}
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="pb-6 border-b border-white/10">
                    <p className="text-[10px] font-black uppercase text-blue-300/60 mb-1">
                      Fecha
                    </p>
                    <p className="text-lg font-bold text-white">
                      {detalles[0]
                        ? new Date().toLocaleDateString()
                        : "Cargando..."}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-blue-300/60 mb-1">
                      Cajero
                    </p>
                    <p className="text-lg font-bold text-white">{user_name}</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 space-y-3">
                <button
                  onClick={() => router.push(`/editarventa/${idVenta}`)}
                  className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all shadow-lg active:scale-95"
                >
                  EDITAR REGISTRO
                </button>
                <button
                  onClick={handleAnularVenta}
                  disabled={loading}
                  className={`w-full font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all active:scale-95 border ${
                    loading
                      ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white"
                  }`}
                >
                  {loading ? "PROCESANDO..." : "ANULAR VENTA"}
                </button>
              </div>
            </div>

            {/* 2. LISTADO DE PRODUCTOS (CENTRO) - AQUI USAMOS LA BD */}
            <div
              className="flex-1 p-10"
              style={{ backgroundColor: theme.card }}
            >
              <div
                className="flex items-center justify-between mb-8 border-b pb-4"
                style={{ borderColor: theme.border }}
              >
                <h4
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: theme.textMuted }}
                >
                  Artículos Vendidos
                </h4>
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: theme.subtle,
                    color: theme.textMuted,
                  }}
                >
                  {detalles.length} items
                </span>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {loading ? (
                  <div className="p-20 text-center animate-pulse font-black text-xs uppercase opacity-50">
                    Cargando productos...
                  </div>
                ) : (
                  detalles.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="border rounded-2xl p-4 flex items-center justify-between group"
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm border transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                          }}
                        >
                          📦
                        </div>
                        <div>
                          <p className="text-base font-black leading-none">
                            {item.nombre_producto}
                          </p>
                          <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase tracking-wider">
                            {item.categoria || "General"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-12 items-center">
                        <div className="text-right">
                          <p
                            className="text-[10px] font-bold uppercase"
                            style={{ color: theme.textMuted }}
                          >
                            Unitario
                          </p>
                          <p className="text-sm font-black">
                            $
                            {Number(item.precio_unitario).toLocaleString(
                              "de-DE",
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-[10px] font-bold uppercase"
                            style={{ color: theme.textMuted }}
                          >
                            Cant.
                          </p>
                          <p className="text-xl font-black tracking-tighter">
                            {item.cantidad?.toString().padStart(2, "0")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* 3. TOTALES (DERECHA) */}
            <div
              className="w-full lg:w-80 p-10 border-l flex flex-col justify-between"
              style={{
                backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                borderColor: theme.border,
              }}
            >
              <div>
                <h4
                  className="font-black text-[10px] uppercase tracking-widest mb-8 pb-4 border-b"
                  style={{ color: theme.textMuted, borderColor: theme.border }}
                >
                  Resumen de Pago
                </h4>
                <div className="space-y-5">
                  <div
                    className="flex justify-between text-sm font-bold"
                    style={{ color: theme.textMuted }}
                  >
                    <span>Sub-Total</span>
                    <span style={{ color: theme.text }}>
                      ${totalVenta.toLocaleString("de-DE")}
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-[10px] font-black p-3 rounded-xl uppercase tracking-widest"
                    style={{
                      backgroundColor: isDark ? "#064E3B" : "#ECFDF5",
                      color: "#10B981",
                    }}
                  >
                    <span>Descuento</span>
                    <span>-$0</span>
                  </div>
                </div>
              </div>

              <div
                className="pt-8 mt-8 border-t"
                style={{ borderColor: theme.border }}
              >
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-1"
                  style={{ color: theme.textMuted }}
                >
                  Monto Final
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-blue-500">$</span>
                  <h3
                    className="text-5xl font-black tracking-tighter italic"
                    style={{ color: isDark ? "#FFF" : "#1E3A5F" }}
                  >
                    {totalVenta.toLocaleString("de-DE")}
                  </h3>
                </div>
                <div
                  className="mt-6 p-4 border rounded-2xl flex items-center gap-3 shadow-sm transition-colors"
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  }}
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span
                    className="text-[10px] font-black uppercase tracking-widest"
                    style={{ color: theme.textMuted }}
                  >
                    Pago en Efectivo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
