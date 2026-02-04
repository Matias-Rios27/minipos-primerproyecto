"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getProducts, getNotificaciones } from "@/lib/api";
import { Producto, Alerta, CartItem } from "@/types/types";

export default function SalesPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // <--- Control de transiciones
  const [products, setProducts] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Todos los Artículos", active: true, icon: "grid" },
    { name: "Bebidas", icon: "🥤" },
    { name: "Alimentos", icon: "🍱" },
    { name: "Limpieza", icon: "🧼" },
    { name: "Mascotas", icon: "🐾" },
  ];

  const theme = {
      bg: isDark ? "#0B1120" : "#F8FAFC",
      header: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
      card: isDark ? "#111827" : "#FFFFFF",
      text: isDark ? "#F1F5F9" : "#1E293B",
      textMuted: isDark ? "#94A3B8" : "#64748B",
      border: isDark ? "#1E293B" : "#E2E8F0",
      subtle: isDark ? "#1F2937" : "#F1F5F9",
    };

  // 1. Persistencia y Sincronización sin parpadeo
  useEffect(() => {
    // Sincronización inmediata con el HTML (Script del Layout ya hizo su trabajo)
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(isCurrentlyDark);

    // Activamos las transiciones un poco después del montaje
    const timer = setTimeout(() => setIsMounted(true), 100);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    const loadData = async () => {
      try {
        const prodData = await getProducts();
        setProducts(prodData || []);
        const notifyData = await getNotificaciones();
        setAlertas(notifyData || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const addToCart = (product: Producto) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.producto_id === product.producto_id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.producto_id === product.producto_id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const totalCart = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    // La clase duration-500 solo se aplica si isMounted es true
    <div className={`flex h-screen font-sans overflow-hidden ${
      isMounted ? "transition-colors duration-500" : "transition-none"
    } ${isDark ? "bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}>
      
      {/* 1. SIDEBAR IZQUIERDO */}
      <aside className={`w-72 flex flex-col shadow-2xl z-40 ${
        isMounted ? "transition-colors duration-500" : "transition-none"
      } ${isDark ? "bg-[#111827] border-r border-white/5" : "bg-white border-r border-slate-200"}`}>
        <div className="p-8">
          <h2 className={`text-2xl font-black tracking-tighter flex items-center gap-2 ${isDark ? "text-white" : "text-[#275791]"}`}>
            <span className="bg-[#275791] w-8 h-8 rounded-lg flex items-center justify-center text-sm text-white shadow-lg">MP</span>
            MiniPOS <span className="text-blue-400">MTZ</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Categorías</p>
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                cat.active 
                  ? "bg-[#275791] text-white shadow-lg shadow-blue-900/40" 
                  : isDark ? "text-slate-400 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="opacity-70">{cat.icon === 'grid' ? '⊞' : cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
          <button
            onClick={() => router.push("/login")}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-20 border-b px-8 flex justify-between items-center z-30 ${
          isMounted ? "transition-colors duration-500" : "transition-none"
        } ${isDark ? "bg-[#111827]/80 border-white/5" : "bg-white/80 border-slate-200"} backdrop-blur-md`}>
          <div>
            <h1 className={`text-lg font-bold ${isDark ? "text-white" : "text-[#275791]"}`}>Punto de Venta</h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Terminal Activa • Quilicura_POS_01
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Botones de Navegación */}
            <div className={`hidden md:flex p-1 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}>
              <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Punto de Venta</button>
              <button onClick={() => router.push("/historial")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Historial</button>
              <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
              <button onClick={() => router.push("/dashboard")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Dashboard</button>
            </div>

            {/* CONTENEDOR DE NOTIFICACIONES */}
             {/* BOTÓN Y DROPDOWN NOTIFICACIONES */}
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

            {/* Botón Dark Mode */}
            <button onClick={toggleDarkMode} className={`p-2.5 rounded-xl border transition-all active:scale-90 ${isDark ? "bg-white/5 border-white/10 text-yellow-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative mb-10">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o código..."
                className={`w-full border rounded-2xl py-4 px-14 outline-none transition-all font-bold ${
                  isDark ? "bg-white/5 border-white/10 focus:border-blue-500 text-white" : "bg-white border-slate-200 focus:border-[#275791]"
                }`}
              />
              <span className="absolute left-5 top-4.5 opacity-30 text-xl">🔍</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {products
                .filter((p) => p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((product) => (
                  <motion.div
                    key={product.producto_id}
                    whileHover={{ y: -6, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                    className={`group relative rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                      isDark 
                        ? "bg-[#111827] border-slate-800" 
                        : "bg-white border-slate-200 shadow-sm"
                    }`}
                  >
                    {/* BADGE DE STOCK - Visualización de disponibilidad profesional */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg backdrop-blur-md border ${
                        product.stock > 10 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      }`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
                      </span>
                    </div>

                    {/* CONTENEDOR DE IMAGEN / ICONO */}
                    <div className={`relative h-48 flex items-center justify-center transition-colors duration-500 ${
                      isDark ? "bg-slate-800/50" : "bg-slate-50"
                    }`}>
                      {/* Sutil degradado de fondo para realzar el objeto */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/5 opacity-20"></div>
                      
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-700 ease-out z-10 drop-shadow-xl">
                        {/* Aquí podrías poner product.imagen_url si existiera */}
                        📦
                      </span>
                    </div>

                    {/* CUERPO DE LA CARD */}
                    <div className="p-6">
                      <div className="mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] opacity-50 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Cod: {String(product.producto_id).padStart(5, '0')}
                        </span>
                        <h3 className={`text-lg font-bold leading-tight line-clamp-2 mt-1 ${
                          isDark ? "text-slate-100" : "text-slate-800"
                        }`}>
                          {product.nombre}
                        </h3>
                      </div>

                      <div className={`my-4 border-t border-dashed ${isDark ? "border-slate-800" : "border-slate-100"}`}></div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-bold uppercase opacity-50 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            Precio Unitario
                          </span>
                          <p className={`text-2xl font-black tracking-tighter ${
                            isDark ? "text-blue-400" : "text-[#1E3A5F]"
                          }`}>
                            ${new Intl.NumberFormat("es-CL").format(product.precio)}
                          </p>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToCart(product)}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                            isDark 
                              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]" 
                              : "bg-[#1E3A5F] hover:bg-slate-800 text-white shadow-lg shadow-blue-900/10"
                          }`}
                        >
                          Añadir
                          <span className="text-sm">+</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* 3. PANEL DE CHECKOUT */}
      <aside className={`w-[400px] flex flex-col shadow-2xl z-40 ${
        isMounted ? "transition-colors duration-500" : "transition-none"
      } ${isDark ? "bg-[#111827] border-l border-white/5" : "bg-white border-l border-slate-200"}`}>
        <div className={`p-8 border-b ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-800"}`}>Detalle Venta</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setCart([])} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">🗑️</button>
              <span className="text-xs bg-[#275791] text-white px-3 py-1 rounded-full font-bold">{cart.length}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                key={item.producto_id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-2xl border transition-all ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}
              >
                <div className="flex justify-between items-start">
                  <p className={`text-xs font-bold uppercase flex-1 ${isDark ? "text-white" : "text-slate-800"}`}>{item.nombre}</p>
                  <span className="bg-blue-600/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-md font-black ml-2">x{item.cantidad}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-slate-400 font-bold text-[10px]">${new Intl.NumberFormat("es-CL").format(item.precio)} u.</p>
                  <p className={`font-black text-sm ${isDark ? "text-blue-400" : "text-slate-900"}`}>${new Intl.NumberFormat("es-CL").format(item.precio * item.cantidad)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className={`p-8 ${isDark ? "bg-[#275791]" : "bg-[#111827]"} text-white rounded-t-[40px] shadow-2xl transition-colors duration-500`}>
          <div className="flex justify-between items-end mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">Total Final</span>
            <span className="text-4xl font-black tracking-tighter">${new Intl.NumberFormat("es-CL").format(totalCart)}</span>
          </div>
          <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${
            isDark ? "bg-white text-[#275791] hover:bg-slate-100" : "bg-blue-600 text-white hover:bg-blue-500"
          }`}>
            Procesar Pago
          </button>
        </div>
      </aside>
    </div>
  );
}