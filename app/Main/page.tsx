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
            <div className={`hidden md:flex p-1 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}>
              <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? {backgroundColor: "#334155", color: "#60A5FA"} : {}}>Punto de Venta</button>
              <button onClick={() => router.push("/historial")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Historial</button>
              <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Inventario</button>
              <button onClick={() => router.push("/dashboard")} className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity">Dashboard</button>
            </div>

            <button 
                onClick={() => setShowNotificaciones(!showNotificaciones)} 
                className={`p-2.5 rounded-xl border relative transition-all active:scale-90 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <span className="text-lg">🔔</span>
                {alertas.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center font-bold">
                    {alertas.length}
                  </span>
                )}
            </button>

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
              {products.filter(p => p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                <motion.div 
                  key={product.producto_id} 
                  whileHover={{ y: -5 }}
                  className={`group rounded-3xl border p-2 hover:shadow-2xl transition-all duration-300 ${isDark ? "bg-[#111827] border-white/5" : "bg-white border-slate-200"}`}
                >
                  <div className={`relative h-44 rounded-[22px] mb-4 flex items-center justify-center ${isDark ? "bg-white/5" : "bg-slate-50"}`}>
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-500">📦</span>
                  </div>
                  <div className="px-4 pb-4">
                    <h3 className={`font-bold line-clamp-1 ${isDark ? "text-white" : "text-slate-800"}`}>{product.nombre}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <p className={`text-2xl font-black ${isDark ? "text-blue-400" : "text-slate-900"}`}>
                        ${new Intl.NumberFormat("es-CL").format(product.precio)}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#275791] text-white w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-all shadow-lg text-xl"
                      >
                        +
                      </button>
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