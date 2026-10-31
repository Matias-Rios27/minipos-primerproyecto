"use client";

import { useIsDark } from "@/app/components/ThemeProvider";
import { getNombreUsuario } from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Venta } from "@/types/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Icon from "@/app/components/Icon";

export default function HistorialClient({ ventasIniciales }: { ventasIniciales: Venta[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useIsDark();
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");

  // ESTADOS PARA DATOS DE BASE DE DATOS
  const [ventas] = useState<Venta[]>(ventasIniciales);

  const exportarReportePDF = () => {
    const doc = new jsPDF();
    const fechaGeneracion = new Date().toLocaleString("es-CL");

    // 1. Configuración de Estilos y Encabezado
    doc.setFillColor(30, 58, 95); // Color #1E3A5F
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE VENTAS - MP", 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado por: ${userName}`, 14, 33);
    doc.text(`Fecha de reporte: ${fechaGeneracion}`, 140, 33);

    const tableRows = filteredVentas.map((venta) => [
      `#V-${venta.venta_id}`,
      new Date(venta.fecha_venta).toLocaleString("es-CL"),
      `${venta.usuario_nombre ?? "Sin usuario"}`,
      `$${new Intl.NumberFormat("es-CL").format(venta.total)}`,
    ]);

    // 3. Generar la Tabla
    autoTable(doc, {
      startY: 45,
      head: [["ID Transacción", "Fecha y Hora", "Usuario", "Monto Total"]],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [39, 87, 145],
        fontSize: 10,
        halign: "center",
        fontStyle: "bold",
      },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        3: { halign: "right", fontStyle: "bold" }, // Monto a la derecha
      },
      didDrawPage: (data) => {
        // Pie de página
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Página ${data.pageNumber} - Sistema de Gestión Quilicura_DB_v2`,
          14,
          doc.internal.pageSize.height - 10,
        );
      },
    });

    // 4. Descargar el archivo
    doc.save(`Reporte_Ventas_${new Date().getTime()}.pdf`);
  };

  // 1. SINCRONIZACIÓN Y CARGA DE DATOS REALES
  useEffect(() => {
    getNombreUsuario().then(setUserName);

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

  // PALETA DINÁMICA
  const theme = useMemo(
    () => ({
      bg: isDark ? "#0B1120" : "#F8FAFC",
      header: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
      card: isDark ? "#111827" : "#FFFFFF",
      text: isDark ? "#F1F5F9" : "#1E293B",
      textMuted: isDark ? "#94A3B8" : "#64748B",
      border: isDark ? "#1E293B" : "#E2E8F0",
      subtle: isDark ? "#1F2937" : "#F1F5F9",
      tableRow: isDark ? "hover:bg-blue-900/10" : "hover:bg-blue-50/30",
    }),
    [isDark],
  );

  const filteredVentas = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return ventas;

    // Creamos una versión sin "decoraciones" para cuando busques IDs numéricos
    const numericTerm = term.replace(/[#v\-usr]/g, "");

    return ventas.filter((venta) => {
      // 1. Preparamos todos los datos como texto simple
      const idVenta = `#v-${venta.venta_id}`.toLowerCase();
      const idUsuario = (venta.usuario_nombre ?? "").toLowerCase();
      const total = `$${venta.total}`.toLowerCase();
      const fecha = venta.fecha_venta
        ? new Date(venta.fecha_venta).toLocaleString("es-CL").toLowerCase()
        : "";

      // 2. Buscamos lo más parecido (coincidencia parcial)
      return (
        idVenta.includes(term) || // Coincide con "#v-10"
        idUsuario.includes(term) || // Coincide con "usr-1"
        idVenta.includes(numericTerm) || // Coincide con el número "10" solo
        idUsuario.includes(numericTerm) || // Coincide con el número "1" solo
        total.includes(term) || // Coincide con el precio
        fecha.includes(term) // Coincide con la fecha/hora
      );
    });
  }, [ventas, searchTerm]);

  



  return (
    <div
      className={`flex flex-col flex-1 min-h-0 font-sans overflow-hidden ${isMounted ? "transition-colors duration-500" : "transition-none"}`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* HEADER SUPERIOR */}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Escribe ID de compra (#V-...), nombre de usuario o fecha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded-2xl py-4 px-14 outline-none text-sm font-bold transition-all focus:ring-2 focus:ring-blue-500/20"
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                }}
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30 text-xl">
                <Icon name="search" />
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black opacity-50 hover:opacity-100"
                >
                  LIMPIAR
                </button>
              )}
            </div>
            <button
              onClick={exportarReportePDF}
              className="bg-[#275791] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              Exportar Reporte ({filteredVentas.length})
            </button>
          </div>

          <div
            className="rounded-3xl border shadow-xl overflow-hidden"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: theme.subtle }}>
                  <th
                    className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: theme.textMuted }}
                  >
                    ID Transacción
                  </th>
                  <th
                    className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: theme.textMuted }}
                  >
                    Fecha
                  </th>
                  <th
                    className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: theme.textMuted }}
                  >
                    Usuario
                  </th>
                  <th
                    className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{ color: theme.textMuted }}
                  >
                    Monto Total
                  </th>
                  <th
                    className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-center"
                    style={{ color: theme.textMuted }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: theme.border }}>
                {
                  <AnimatePresence mode="popLayout">
                    {filteredVentas.map((venta) => (
                      <motion.tr
                        key={venta.venta_id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`transition-colors group ${theme.tableRow}`}
                      >
                        <td className="px-6 py-5">
                          <span className="font-black text-blue-500 text-sm">
                            #V-{venta.venta_id}
                          </span>
                        </td>
                        <td
                          className="px-6 py-5 text-[12px] font-bold"
                          style={{ color: theme.textMuted }}
                        >
                          {new Date(venta.fecha_venta).toLocaleString("es-CL")}
                        </td>
                        <td className="px-6 py-5 text-sm font-black uppercase tracking-tight">
                          {venta.usuario_nombre ?? "Sin usuario"}
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-emerald-500">
                            $
                            {new Intl.NumberFormat("es-CL").format(venta.total)}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() =>
                              router.push(`/historial/${venta.venta_id}`)
                            }
                            className="p-2 rounded-xl border border-transparent transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90"
                            style={{
                              backgroundColor: theme.subtle,
                              borderColor: theme.border,
                            }}
                          >
                            <Icon name="eye" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                }
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-between items-center px-4">
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: theme.textMuted }}
            >
              Sync: Quilicura_DB_v2 | Registros: {ventas.length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
