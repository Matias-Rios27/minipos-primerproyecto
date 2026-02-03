"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function EditarProductoPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [status, setStatus] = useState("active");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 1. SINCRONIZACIÓN Y PERMANENCIA
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
      className={`flex flex-col h-screen font-sans overflow-hidden ${
        isMounted ? "transition-colors duration-500" : "transition-none"
      }`}
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* HEADER SUPERIOR */}
      <header
        className={`h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0 ${
          isMounted ? "transition-colors duration-500" : "transition-none"
        }`}
        style={{ backgroundColor: theme.header, borderColor: theme.border }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">
              MP
            </div>
            <h1
              className="text-lg font-bold"
              style={{ color: isDark ? "#FFF" : "#1E293B" }}
            >
              Gestión de Inventario
            </h1>
          </div>
          <div
            className="flex items-center gap-2 text-xs font-medium"
            style={{ color: theme.textMuted }}
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Editando Registro • productos_id: #241
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`hidden md:flex p-1 rounded-xl mr-4 border ${
              isMounted ? "transition-colors duration-500" : "transition-none"
            }`}
            style={{ backgroundColor: theme.subtle, borderColor: theme.border }}
          >
            <button
              onClick={() => router.push("/Main")}
              className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-all"
            >
              Punto de Venta
            </button>
            <button
              onClick={() => router.push("/inventario")}
              className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-all"
            >
              Inventario
            </button>
            <button
              className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm"
              style={
                isDark ? { backgroundColor: "#334155", color: "#60A5FA" } : {}
              }
            >
              Editar
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-all"
            >
              Dashboard
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border transition-all text-lg shadow-sm hover:scale-105 active:scale-90"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <button
              className="p-2.5 rounded-xl border transition-all relative active:scale-90"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <span className="text-lg italic">🔔</span>
              <span
                className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2"
                style={{ borderColor: theme.card }}
              ></span>
            </button>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            MT
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all group"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>{" "}
            Volver al Inventario
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* LADO IZQUIERDO: IMAGEN */}
            <div className="w-full md:w-1/3">
              <div
                className={`rounded-3xl border shadow-xl p-8 flex flex-col items-center ${isMounted ? "transition-colors duration-500" : ""}`}
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }}
              >
                <div className="w-full aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 relative group overflow-hidden">
                  {/* Muestra la imagen seleccionada o el icono de caja por defecto */}
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl opacity-20">📦</span>
                  )}

                  {/* Input de archivo oculto */}
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      // Solución al error de e.target.files posiblemente null
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImage(URL.createObjectURL(file));
                      }
                    }}
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={() => {
                        // Solución al error de getElementById posiblemente null
                        const input = document.getElementById(
                          "fileInput",
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                      className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-90 transition-transform"
                    >
                      {selectedImage ? "Cambiar Imagen" : "Subir Imagen"}
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                  {selectedImage ? "Imagen Cargada" : "Sin Imagen"}
                </p>
              </div>
            </div>

            {/* LADO DERECHO: FORMULARIO */}
            <div className="flex-1">
              <div
                className={`rounded-3xl border shadow-xl overflow-hidden ${isMounted ? "transition-colors duration-500" : ""}`}
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }}
              >
                <div
                  className="p-8 border-b"
                  style={{
                    borderColor: theme.border,
                    backgroundColor: theme.subtle,
                  }}
                >
                  <h2 className="text-xl font-black uppercase tracking-tighter">
                    Ficha Técnica de Edición
                  </h2>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-tight">
                    Sincronizado con tabla: productos
                  </p>
                </div>

                <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label
                      className="text-[10px] font-black uppercase ml-2 mb-2 block"
                      style={{ color: theme.textMuted }}
                    >
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      defaultValue="Coca cola 3L"
                      className="w-full border rounded-2xl py-4 px-6 outline-none transition-all text-sm font-bold"
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="text-[10px] font-black uppercase ml-2 mb-2 block"
                      style={{ color: theme.textMuted }}
                    >
                      Precio Venta ($)
                    </label>
                    <input
                      type="number"
                      defaultValue="1800"
                      className="w-full border rounded-2xl py-4 px-6 outline-none transition-all text-sm font-black text-blue-600"
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="text-[10px] font-black uppercase ml-2 mb-2 block"
                      style={{ color: theme.textMuted }}
                    >
                      Stock Actual (Int)
                    </label>
                    <input
                      type="number"
                      defaultValue="24"
                      className="w-full border rounded-2xl py-4 px-6 outline-none transition-all text-sm font-bold"
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="text-[10px] font-black uppercase ml-2 mb-2 block"
                      style={{ color: theme.textMuted }}
                    >
                      Stock Mínimo (Alerta)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full border rounded-2xl py-4 px-6 outline-none transition-all text-sm font-bold text-rose-500"
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="text-[10px] font-black uppercase ml-2 mb-2 block"
                      style={{ color: theme.textMuted }}
                    >
                      Vencimiento
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded-2xl py-4 px-6 outline-none transition-all text-sm font-bold"
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                        color: theme.text,
                      }}
                    />
                  </div>

                  {/* Estado (activo) */}
                  <div className="md:col-span-2 space-y-2 mt-4">
                    <label
                      className="text-[10px] font-black uppercase ml-2 block"
                      style={{ color: theme.textMuted }}
                    >
                      Visibilidad en Tienda
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStatus("active")}
                        className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all active:scale-95 ${status === "active" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}
                      >
                        ACTIVO
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus("out")}
                        className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all active:scale-95 ${status === "out" ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}
                      >
                        OCULTO / INACTIVO
                      </button>
                    </div>
                  </div>

                  {/* BOTONES ACCIÓN */}
                  <div className="md:col-span-2 mt-8 flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1E3A5F] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
                    >
                      ✅ Guardar Cambios
                    </button>
                    <button
                      type="button"
                      className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border transition-all active:scale-95"
                      style={{
                        backgroundColor: theme.subtle,
                        borderColor: theme.border,
                        color: isDark ? "#F87171" : "#EF4444",
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
