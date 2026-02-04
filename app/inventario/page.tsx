"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getNotificaciones, getProducts, deleteProduct } from "@/lib/api"; // 1. IMPORTACIÓN DE API
import { Alerta } from "@/types/types";

export default function InventoryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  
  // --- ESTADOS PARA DATOS REALES ---
  const [products, setProducts] = useState<any[]>([]); // 2. ESTADO PARA PRODUCTOS DE DB
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);

  // 1. SINCRONIZACIÓN Y PERMANENCIA
  useEffect(() => {
    const storedUser = localStorage.getItem("user_name") || "Admin"; 
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

    // 3. CARGA DE DATOS REALES (PRODUCTOS Y ALERTAS)
    const loadAllData = async () => {
      try {
        const [dataAlerts, dataProds] = await Promise.all([
          getNotificaciones(),
          getProducts() // Trae los productos de tu base de datos
        ]);
        setAlertas(dataAlerts || []);
        setProducts(dataProds || []);
      } catch (e) {
        console.error("Error cargando datos del servidor", e);
      }
    };
    loadAllData();

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // 4. FUNCIÓN PARA ELIMINAR PRODUCTO
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(id);
        // Actualizar el estado local para que desaparezca de la tabla sin recargar
        setProducts(products.filter(p => p.producto_id !== id));
      } catch (error) {
        alert("Error al eliminar el producto");
      }
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

  const theme = useMemo(() => ({
    bg: isDark ? "#0B1120" : "#F8FAFC",
    header: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
    card: isDark ? "#111827" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    subtle: isDark ? "#1F2937" : "#F1F5F9",
    tableRow: isDark ? "hover:bg-blue-900/10" : "hover:bg-blue-50/30"
  }), [isDark]);

  // 5. MAPEADOR DE CATEGORÍAS (Para mostrar el nombre en lugar del ID)
  const categoryNames: Record<number, string> = {
    1: "Bebidas", 2: "Alimentos", 3: "Limpieza", 
    4: "Cuidado Personal", 5: "Electrónicos", 6: "Mascotas"
  };

  const filteredProducts = products.filter(p => 
    p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.proveedor_id?.toString().includes(searchTerm.toLowerCase())
  );

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
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">MP</div>
            <h1 className="text-lg font-bold">Gestión de Inventario</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            {products.length} Productos registrados • Sucursal Quilicura
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden md:flex p-1 rounded-xl mr-4 border ${
            isMounted ? "transition-colors duration-500" : "transition-none"
          }`} style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Punto de Venta</button>
            <button onClick={() => router.push("/historial")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Historial</button>
            <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Inventario</button>
            <button onClick={() => router.push("/dashboard")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Dashboard</button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border transition-all text-lg shadow-sm hover:scale-105 active:scale-90"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotificaciones(!showNotificaciones)}
                className="p-2.5 rounded-xl border transition-all relative active:scale-90 hover:bg-slate-500/5" 
                style={{ backgroundColor: theme.card, borderColor: theme.border }}
              >
                <span className="text-lg italic">🔔</span>
                {alertas.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-[#111827]">
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
                      <h3 className="text-xs font-black uppercase tracking-widest">Alertas Recientes</h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] text-white font-bold">{alertas.length}</span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {alertas.length > 0 ? (
                        alertas.map((alerta) => (
                          <div key={alerta.notificacion_id} className="p-4 border-b last:border-0 hover:bg-slate-500/5 transition-colors" style={{ borderColor: theme.border }}>
                            <div className="flex gap-3 text-xs">
                              <span className="text-lg">{alerta.tipo === 'stock' ? '📉' : '⚠️'}</span>
                              <div>
                                <p className="font-bold">{alerta.mensaje}</p>
                                <p className="opacity-50 mt-1">Revisar stock en Inventario</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center opacity-40 text-xs font-bold">Sin alertas pendientes</div>
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* BARRA DE ACCIONES */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Buscar por nombre o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full border rounded-2xl py-4 px-14 outline-none text-sm font-medium ${
                    isMounted ? "transition-all duration-500" : ""
                }`}
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
              />
              <span className="absolute left-5 top-4.5 opacity-30 text-xl">🔍</span>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => router.push("/listaproveedores")}
                className="flex-1 md:flex-none border px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
              >
                📞 Proveedores
              </button>
              <button 
                onClick={() => router.push("/agregarproducto")}
                className="flex-1 md:flex-none bg-[#1E3A5F] text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <span>➕</span> Nuevo Producto
              </button>
            </div>
          </div>

          {/* TABLA DE PRODUCTOS */}
          <div 
            className={`rounded-3xl border shadow-xl overflow-hidden ${
                isMounted ? "transition-colors duration-500" : "transition-none"
            }`}
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: theme.subtle }} className={isMounted ? "transition-colors duration-500" : ""}>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Producto</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Categoría</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textMuted }}>Stock</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center" style={{ color: theme.textMuted }}>Precio Venta</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: theme.textMuted }}>Estado</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-right" style={{ color: theme.textMuted }}>Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isMounted ? "transition-colors duration-500" : ""}`} style={{ borderColor: theme.border }}>
                <AnimatePresence>
                  {filteredProducts.map((p) => (
                    <motion.tr 
                      key={p.producto_id} // Clave real de tu DB
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`transition-colors group ${theme.tableRow}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center border p-1 overflow-hidden" style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
                            {p.imagen_url ? (
                              <img 
                                src={p.imagen_url.startsWith('http') ? p.imagen_url : `https://minipos-primerproyecto-backend.onrender.com${p.imagen_url}`} 
                                className="w-full h-full object-cover rounded-lg"
                                alt={p.nombre}
                              />
                            ) : <span className="text-xl">📦</span>}
                          </div>
                          <span className="font-bold text-sm">{p.nombre}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {categoryNames[p.categoria_id as number] || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-black text-sm ${p.stock <= p.stock_minimo ? 'text-rose-500' : ''}`}>
                          {p.stock} un.
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-base">
                        ${Number(p.price || p.precio).toLocaleString()}
                      </td>
                     <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        {/* Indicador de Stock */}
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${p.stock <= p.stock_minimo ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                          <span className="text-[10px] font-bold uppercase opacity-60">
                            {p.stock <= p.stock_minimo ? 'Reponer' : 'Stock OK'}
                          </span>
                        </div>

                        {/* BADGE DE VISIBILIDAD (DISPONIBLE / OCULTO) */}
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md w-fit border ${
                          p.activo 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}>
                          <span className="text-[10px] font-black uppercase tracking-wider">
                            {p.activo ? '🌐 Disponible' : '🚫 Oculto'}
                          </span>
                        </div>
                      </div>
                    </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => router.push(`/editarproducto/${p.producto_id}`)}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-90"
                            style={isDark ? {backgroundColor: "#1F2937", borderColor: "#374151"} : {}}
                          >✏️</button>
                          <button 
                            onClick={() => handleDelete(p.producto_id)}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-rose-500 hover:bg-rose-50 transition-all shadow-sm active:scale-90"
                            style={isDark ? {backgroundColor: "#1F2937", borderColor: "#374151"} : {}}
                          >🗑️</button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* FOOTER INVENTARIO */}
          <div className="mt-6 flex justify-between items-center px-4">
            <div className="flex items-center gap-4 text-xs font-bold" style={{ color: theme.textMuted }}>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-rose-500 rounded-full"></span> Stock Bajo
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Stock OK
                </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-xl text-xs font-bold transition-all active:scale-95" style={{ backgroundColor: theme.card, borderColor: theme.border }}>Anterior</button>
              <button className="px-4 py-2 border rounded-xl text-xs font-bold transition-all active:scale-95" style={{ backgroundColor: theme.card, borderColor: theme.border }}>Siguiente</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}