"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNotificaciones,
  deleteNotificacion,
  getGastos,
  createGasto,
  deleteGasto as apiDeleteGasto,
  getCategoriasGasto,
} from "@/lib/api";
import { Alerta, Gasto, CategoriaGasto } from "@/types/types";

// ── Icono por categoría ───────────────────────────────────────────────────
const categoriaIcon: Record<string, string> = {
  Servicios:     "🏠",
  Abastecimiento: "🚚",
  Logística:     "🔧",
  Personal:      "👥",
  Marketing:     "📣",
  Arriendo:      "🏢",
  Otros:         "📋",
};

const categoriaColor: Record<string, { bg: string; text: string }> = {
  Servicios:     { bg: "bg-blue-100",   text: "text-blue-600" },
  Abastecimiento:{ bg: "bg-orange-100", text: "text-orange-600" },
  Logística:     { bg: "bg-purple-100", text: "text-purple-600" },
  Personal:      { bg: "bg-emerald-100",text: "text-emerald-600" },
  Marketing:     { bg: "bg-pink-100",   text: "text-pink-600" },
  Arriendo:      { bg: "bg-amber-100",  text: "text-amber-600" },
};

export default function GestionGastosPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userName, setUserName] = useState("Usuario");
  const [userId, setUserId] = useState<number | null>(null);

  // Datos de BD
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [loadingGastos, setLoadingGastos] = useState(true);

  // Modal nuevo gasto
  const [showModal, setShowModal] = useState(false);
  const [formCategoria, setFormCategoria] = useState<string>("");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formMonto, setFormMonto] = useState("");
  const [savingGasto, setSavingGasto] = useState(false);
  const [formError, setFormError] = useState("");

  // Notificaciones
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const theme = {
    bg:       isDark ? "#0B1120" : "#F8FAFC",
    header:   isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
    card:     isDark ? "#111827" : "#FFFFFF",
    text:     isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border:   isDark ? "#1E293B" : "#E2E8F0",
    subtle:   isDark ? "#1F2937" : "#F1F5F9",
  };

  // ── Carga inicial ──────────────────────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem("user_name") || "Admin";
    const storedId   = localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
    setUserName(storedUser);
    if (storedId) setUserId(parseInt(storedId));

    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    const timer = setTimeout(() => setIsMounted(true), 100);

    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotificaciones(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const loadAll = async () => {
      setLoadingGastos(true);
      try {
        const [gastosData, alertsData, catData] = await Promise.all([
          getGastos(),
          getNotificaciones(),
          getCategoriasGasto(),
        ]);
        setGastos(gastosData || []);
        setAlertas(alertsData || []);
        setCategorias(catData || []);
      } catch (e) {
        console.error("Error cargando gastos", e);
      } finally {
        setLoadingGastos(false);
      }
    };
    loadAll();

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

  // ── Filtro de gastos ───────────────────────────────────────────────────
  const filteredGastos = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return gastos;
    return gastos.filter(
      (g) =>
        g.descripcion?.toLowerCase().includes(term) ||
        g.categoria_nombre?.toLowerCase().includes(term)
    );
  }, [gastos, searchTerm]);

  const totalFiltrado = useMemo(
    () => filteredGastos.reduce((s, g) => s + Number(g.monto), 0),
    [filteredGastos]
  );

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleDeleteGasto = async (id: number) => {
    if (!window.confirm("¿Eliminar este gasto? Esta acción no se puede deshacer.")) return;
    try {
      await apiDeleteGasto(id);
      setGastos((prev) => prev.filter((g) => g.gasto_id !== id));
    } catch (e) {
      alert("Error al eliminar el gasto. Intenta de nuevo.");
    }
  };

  const handleCreateGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formDescripcion.trim() || !formMonto || parseFloat(formMonto) <= 0) {
      setFormError("Descripción y monto válido son obligatorios.");
      return;
    }
    setSavingGasto(true);
    try {
      const catId = formCategoria ? parseInt(formCategoria) : undefined;
      const result = await createGasto({
        usuario_id:  userId ?? undefined,
        categoria_id: catId,
        descripcion: formDescripcion.trim(),
        monto:       parseFloat(formMonto),
      });
      setGastos((prev) => [result.gasto, ...prev]);
      setShowModal(false);
      setFormCategoria("");
      setFormDescripcion("");
      setFormMonto("");
    } catch (e: any) {
      setFormError(e?.response?.data?.message || "Error al guardar el gasto.");
    } finally {
      setSavingGasto(false);
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

  const fmt = (n: number) =>
    `$${new Intl.NumberFormat("es-CL").format(Math.round(n))}`;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex flex-col h-screen font-sans overflow-hidden ${
        isMounted ? "transition-colors duration-500" : ""
      }`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* ── HEADER ── */}
      <header
        className={`h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0 ${
          isMounted ? "transition-colors duration-500" : ""
        }`}
        style={{ backgroundColor: theme.header, borderColor: theme.border }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">MP</div>
            <h1 className="text-lg font-bold">Gestión de Gastos</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            Control de Egresos • Sucursal Quilicura
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`hidden md:flex p-1 rounded-xl mr-4 border transition-colors ${
              isMounted ? "duration-500" : ""
            }`}
            style={{ backgroundColor: theme.subtle, borderColor: theme.border }}
          >
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button onClick={() => router.push("/historial")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Historial</button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Dashboard</button>
            <button
              className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm"
              style={isDark ? { backgroundColor: "#334155", color: "#60A5FA" } : {}}
            >
              Gastos
            </button>
          </div>

          <div className="flex items-center gap-2 relative" ref={notifRef}>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border transition-all text-lg shadow-sm active:scale-90"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotificaciones(!showNotificaciones)}
                className="p-2.5 rounded-xl border transition-all relative active:scale-90"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                <span className="text-lg italic">🔔</span>
                {alertas.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center font-bold border-2 border-white">
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
                    className="absolute right-0 mt-2 w-80 rounded-3xl border shadow-2xl z-50 overflow-hidden"
                    style={{ backgroundColor: theme.card, borderColor: theme.border }}
                  >
                    <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: theme.border, backgroundColor: theme.subtle }}>
                      <h3 className="text-xs font-black uppercase tracking-widest">Alertas</h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] text-white font-bold">{alertas.length}</span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {alertas.length > 0 ? alertas.map((a) => (
                        <div key={a.notificacion_id} className="p-4 border-b last:border-0 hover:bg-slate-500/5 transition-colors" style={{ borderColor: theme.border }}>
                          <div className="flex gap-3 text-xs items-center justify-between">
                            <span className="text-lg">{a.tipo === "stock" ? "📉" : "⚠️"}</span>
                            <div className="flex-1"><p className="font-bold">{a.mensaje}</p></div>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteNotificacion(a.notificacion_id); }} className="text-rose-500 bg-rose-500/10 p-1.5 rounded-lg ml-2">❌</button>
                          </div>
                        </div>
                      )) : (
                        <div className="p-10 text-center opacity-40 text-xs font-bold">Sin alertas</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">

          {/* Título + buscador + nuevo gasto */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                Registro de Gastos
              </h2>
              <p className="text-sm font-medium mt-1" style={{ color: theme.textMuted }}>
                {loadingGastos
                  ? "Sincronizando con la base de datos..."
                  : `${gastos.length} registros · Total: ${fmt(gastos.reduce((s, g) => s + Number(g.monto), 0))}`}
              </p>
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
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#1E3A5F] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95 whitespace-nowrap"
              >
                + Nuevo Gasto
              </button>
            </div>
          </div>

          {/* Tabla de gastos */}
          <div
            className="rounded-[32px] border overflow-hidden shadow-sm transition-colors duration-500"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            {/* Encabezado */}
            <div
              className="grid grid-cols-12 px-8 py-5 border-b text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.textMuted }}
            >
              <div className="col-span-2">Categoría</div>
              <div className="col-span-4">Descripción del Egreso</div>
              <div className="col-span-2 text-center">Fecha</div>
              <div className="col-span-2 text-right">Monto</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>

            {/* Filas */}
            <div className="divide-y" style={{ borderColor: theme.border }}>
              {loadingGastos ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="grid grid-cols-12 px-8 py-6 items-center gap-4">
                    {[2, 4, 2, 2, 2].map((cols, j) => (
                      <div
                        key={j}
                        className={`col-span-${cols} h-4 rounded-xl animate-pulse`}
                        style={{ backgroundColor: theme.subtle }}
                      />
                    ))}
                  </div>
                ))
              ) : filteredGastos.length === 0 ? (
                <div className="px-8 py-20 text-center opacity-30">
                  <p className="text-3xl mb-3">💸</p>
                  <p className="text-xs font-black uppercase tracking-widest">
                    {searchTerm ? "Sin resultados para tu búsqueda" : "No hay gastos registrados"}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredGastos.map((gasto, idx) => {
                    const catName = gasto.categoria_nombre || "Otros";
                    const catColors = categoriaColor[catName] || { bg: "bg-slate-100", text: "text-slate-600" };
                    const icon = categoriaIcon[catName] || "📋";

                    return (
                      <motion.div
                        key={gasto.gasto_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.04 }}
                        className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-500/5 transition-colors group"
                      >
                        {/* Categoría */}
                        <div className="col-span-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${catColors.bg} ${catColors.text}`}
                          >
                            <span>{icon}</span>
                            {catName}
                          </span>
                        </div>

                        {/* Descripción */}
                        <div className="col-span-4 font-bold text-sm tracking-tight">
                          {gasto.descripcion}
                          {gasto.usuario_nombre && (
                            <p className="text-[10px] opacity-40 mt-0.5">
                              Por: {gasto.usuario_nombre}
                            </p>
                          )}
                        </div>

                        {/* Fecha */}
                        <div className="col-span-2 text-center text-xs font-medium italic" style={{ color: theme.textMuted }}>
                          {gasto.fecha_gasto
                            ? new Date(gasto.fecha_gasto).toLocaleDateString("es-CL")
                            : "—"}
                        </div>

                        {/* Monto */}
                        <div className="col-span-2 text-right">
                          <span
                            className="text-base font-black tracking-tighter"
                            style={{ color: isDark ? "#F87171" : "#E11D48" }}
                          >
                            -{fmt(Number(gasto.monto))}
                          </span>
                        </div>

                        {/* Acciones */}
                        <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => handleDeleteGasto(gasto.gasto_id)}
                            className="p-2 rounded-xl border hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                            style={{ borderColor: theme.border }}
                            title="Eliminar gasto"
                          >
                            🗑️
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Resumen de totales */}
          <div className="mt-8 flex justify-between items-center">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>
              Sync: Quilicura_DB • {filteredGastos.length} registros
            </p>
            <div
              className="p-6 rounded-[28px] border flex items-center gap-8"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>
                  Total Mostrado
                </p>
                <p className="text-2xl font-black italic tracking-tighter text-rose-500">
                  -{fmt(totalFiltrado)}
                </p>
              </div>
              <div className="h-10 w-px" style={{ backgroundColor: theme.border }} />
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

      {/* ── MODAL NUEVO GASTO ── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            >
              <div
                className="rounded-[32px] border shadow-2xl p-8"
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                {/* Header del modal */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-black tracking-tighter">Nuevo Gasto</h3>
                    <p className="text-xs mt-1 font-medium" style={{ color: theme.textMuted }}>
                      Registra un egreso operativo
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-xl hover:bg-slate-500/10 transition-colors text-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateGasto} className="space-y-5">
                  {/* Categoría */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>
                      Categoría
                    </label>
                    <select
                      value={formCategoria}
                      onChange={(e) => setFormCategoria(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }}
                    >
                      <option value="">Sin categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.categoria_id} value={cat.categoria_id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>
                      Descripción *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Pago cuenta de agua Enero..."
                      value={formDescripcion}
                      onChange={(e) => setFormDescripcion(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }}
                    />
                  </div>

                  {/* Monto */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>
                      Monto (CLP) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-sm opacity-40">$</span>
                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        placeholder="50000"
                        value={formMonto}
                        onChange={(e) => setFormMonto(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 rounded-2xl border text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
                        style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }}
                      />
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {formError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-rose-50 border border-rose-100 p-3 rounded-2xl flex items-center gap-2 text-rose-600 text-xs font-bold"
                      >
                        <span>⚠️</span> {formError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Botones */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3.5 rounded-2xl border text-sm font-black uppercase tracking-widest transition-all hover:bg-slate-500/5"
                      style={{ borderColor: theme.border }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingGasto}
                      className="flex-1 bg-rose-500 text-white py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {savingGasto ? "Guardando..." : "Registrar Gasto"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}