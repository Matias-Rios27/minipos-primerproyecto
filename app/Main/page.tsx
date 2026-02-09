"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getProducts, getNotificaciones, createVenta } from "@/lib/api";
import { Producto, Alerta, CartItem } from "@/types/types";

export default function SalesPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    "Todos los Artículos",
  );
  const [userName, setUserName] = useState("Usuario");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ultimaVenta, setUltimaVenta] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const categories = [
    { name: "Todos los Artículos", active: true, icon: "grid" },
    { name: "Bebidas", icon: "🥤" },
    { name: "Alimentos", icon: "🍱" },
    { name: "Limpieza", icon: "🧼" },
    { name: "Cuidado Personal", icon: "✨" },
    { name: "Electronicos", icon: "💻" },
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
    const storedUser = localStorage.getItem("user_name") || "Admin";
    setUserName(storedUser);

    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(isCurrentlyDark);

    const timer = setTimeout(() => setIsMounted(true), 100);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    const storedId = localStorage.getItem("user_id");
    if (storedId) {
      setUserId(parseInt(storedId));
    }

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
      const existingItem = prevCart.find(
        (item) => item.producto_id === product.producto_id,
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.producto_id === product.producto_id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const totalCart = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowConfirmModal(true);
  };

  const confirmarVentaFinal = async () => {
    try {
      setIsProcessing(true);
      const ventaData = {
        usuario_id: userId!,
        total: totalCart,
        items: cart.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad,
        })),
      };

      const response = await createVenta(ventaData);
      const nuevaVentaId = response.id || response.venta_id;

      if (nuevaVentaId) {
        setUltimaVenta({
          id: nuevaVentaId,
          items: [...cart],
          total: totalCart,
          fecha: new Date().toLocaleString(),
        });

        setCart([]);
        setShowConfirmModal(false); // Cerramos el de confirmación
        setShowSuccessModal(true); // Abrimos el de éxito (si ya lo tenías)
      }
    } catch (error: any) {
      console.error("Error detallado:", error);
      alert("Error al procesar la venta");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`flex h-screen font-sans overflow-hidden ${
        isMounted ? "transition-colors duration-500" : "transition-none"
      } ${isDark ? "bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}
    >
      {/* 1. SIDEBAR IZQUIERDO */}
      <aside
        className={`w-72 flex flex-col shadow-2xl z-40 ${
          isMounted ? "transition-colors duration-500" : "transition-none"
        } ${isDark ? "bg-[#111827] border-r border-white/5" : "bg-white border-r border-slate-200"}`}
      >
        <div className="p-8">
          <h2
            className={`text-2xl font-black tracking-tighter flex items-center gap-2 ${isDark ? "text-white" : "text-[#275791]"}`}
          >
            <span className="bg-[#275791] w-8 h-8 rounded-lg flex items-center justify-center text-sm text-white shadow-lg">
              MP
            </span>
            MiniPOS <span className="text-blue-400">MTZ</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            Categorías
          </p>
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat.name)} // <--- Actualiza el estado
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === cat.name // <--- Compara con el nombre de la categoría
                  ? "bg-[#275791] text-white shadow-lg shadow-blue-900/40"
                  : isDark
                    ? "text-slate-400 hover:bg-white/5"
                    : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="opacity-70">
                {cat.icon === "grid" ? "⊞" : cat.icon}
              </span>
              {cat.name}
            </button>
          ))}
        </nav>

        <div
          className={`p-4 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}
        >
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
        <header
          className={`h-20 border-b px-8 flex justify-between items-center z-30 ${
            isMounted ? "transition-colors duration-500" : "transition-none"
          } ${isDark ? "bg-[#111827]/80 border-white/5" : "bg-white/80 border-slate-200"} backdrop-blur-md`}
        >
          <div>
            <h1
              className={`text-lg font-bold ${isDark ? "text-white" : "text-[#275791]"}`}
            >
              Punto de Venta
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Terminal Activa • Quilicura_POS_01
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Botones de Navegación */}
            <div
              className={`hidden md:flex p-1 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}
            >
              <button
                className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm"
                style={
                  isDark ? { backgroundColor: "#334155", color: "#60A5FA" } : {}
                }
              >
                Punto de Venta
              </button>
              <button
                onClick={() => router.push("/historial")}
                className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity"
              >
                Historial
              </button>
              <button
                onClick={() => router.push("/inventario")}
                className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity"
              >
                Inventario
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 text-xs font-bold opacity-70 hover:opacity-100 transition-opacity"
              >
                Dashboard
              </button>
            </div>

            {/* CONTENEDOR DE NOTIFICACIONES */}
            {/* BOTÓN Y DROPDOWN NOTIFICACIONES */}
            <div className="relative">
              <button
                onClick={() => setShowNotificaciones(!showNotificaciones)}
                className="p-2.5 rounded-xl border transition-all relative active:scale-90 hover:bg-slate-500/5"
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                }}
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
                    style={{
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    }}
                  >
                    <div
                      className="p-4 border-b flex justify-between items-center"
                      style={{
                        borderColor: theme.border,
                        backgroundColor: theme.subtle,
                      }}
                    >
                      <h3 className="text-xs font-black uppercase tracking-widest">
                        Alertas Recientes
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] text-white font-bold">
                        {alertas.length}
                      </span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {alertas.length > 0 ? (
                        alertas.map((alerta) => (
                          <div
                            key={alerta.notificacion_id}
                            className="p-4 border-b last:border-0 hover:bg-slate-500/5 transition-colors"
                            style={{ borderColor: theme.border }}
                          >
                            <div className="flex gap-3 text-xs">
                              <span className="text-lg">
                                {alerta.tipo === "stock" ? "📉" : "⚠️"}
                              </span>
                              <div>
                                <p className="font-bold">{alerta.mensaje}</p>
                                <p className="opacity-50 mt-1">
                                  Revisar stock en Inventario
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center opacity-40 text-xs font-bold">
                          Sin alertas pendientes
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botón Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl border transition-all active:scale-90 ${isDark ? "bg-white/5 border-white/10 text-yellow-400" : "bg-slate-50 border-slate-200 text-slate-600"}`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 shadow-sm">
              {userName.substring(0, 2).toUpperCase()}
            </div>
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
                  isDark
                    ? "bg-white/5 border-white/10 focus:border-blue-500 text-white"
                    : "bg-white border-slate-200 focus:border-[#275791]"
                }`}
              />
              <span className="absolute left-5 top-4.5 opacity-30 text-xl">
                🔍
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {products
                .filter((p) => {
                  const isVisible = p.activo === true;
                  const matchesSearch = p.nombre
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());
                  const categoryMap: { [key: string]: number } = {
                    Bebidas: 1,
                    Alimentos: 2,
                    Limpieza: 3,
                    "Cuidado Personal": 4,
                    Electronicos: 5,
                    Mascotas: 6,
                  };
                  const matchesCategory =
                    selectedCategory === "Todos los Artículos" ||
                    p.categoria_id === categoryMap[selectedCategory];
                  return isVisible && matchesSearch && matchesCategory;
                })
                .map((product) => (
                  <motion.div
                    key={product.producto_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className={`group relative flex flex-col h-full border transition-all duration-200 ${
                      isDark
                        ? "bg-[#1E293B] border-slate-700 shadow-none"
                        : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                    } rounded-xl overflow-hidden`}
                  >
                    {/* 1. ÁREA DE IMAGEN/ICONO */}
                    <div
                      className={`relative aspect-square w-full flex items-center justify-center border-b ${
                        isDark
                          ? "bg-slate-900/50 border-slate-700"
                          : "bg-slate-50 border-slate-100"
                      }`}
                    >
                      {product.imagen_url ? (
                        <img
                          src={
                            product.imagen_url?.startsWith("http")
                              ? product.imagen_url
                              : `https://minipos-primerproyecto-backend.onrender.com${product.imagen_url}`
                          }
                          alt={product.nombre}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center opacity-20">
                          <span className="text-6xl">📦</span>
                          <span className="text-[10px] font-bold mt-2">
                            SIN IMAGEN
                          </span>
                        </div>
                      )}

                      {/* ETIQUETA DE STOCK */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-[9px] font-bold px-2 py-1 rounded-md border backdrop-blur-sm ${
                            product.stock > product.stock_minimo
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}
                        >
                          {product.stock} UNID.
                        </span>
                      </div>
                    </div>

                    {/* 2. INFORMACIÓN DEL PRODUCTO */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-[10px] font-bold tracking-wider uppercase opacity-60 ${isDark ? "text-blue-400" : "text-slate-500"}`}
                        >
                          {categories.find((c) => {
                            const categoryMap: any = {
                              Bebidas: 1,
                              Alimentos: 2,
                              Limpieza: 3,
                              "Cuidado Personal": 4,
                              Electronicos: 5,
                              Mascotas: 6,
                            };
                            return categoryMap[c.name] === product.categoria_id;
                          })?.name || "General"}
                        </span>
                        <span className="text-[9px] font-mono opacity-40">
                          #{String(product.producto_id).padStart(4, "0")}
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-bold leading-snug h-10 line-clamp-2 mb-4 ${
                          isDark ? "text-slate-100" : "text-slate-800"
                        }`}
                      >
                        {product.nombre}
                      </h3>

                      {/* 3. PRECIO Y ACCIÓN */}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-500/10">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold opacity-40 uppercase">
                            Precio
                          </span>
                          <span
                            className={`text-lg font-black ${isDark ? "text-white" : "text-[#1E3A5F]"}`}
                          >
                            $
                            {new Intl.NumberFormat("es-CL").format(
                              product.precio,
                            )}
                          </span>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(product)}
                          className={`p-2.5 rounded-lg transition-colors ${
                            isDark
                              ? "bg-blue-600 hover:bg-blue-500 text-white"
                              : "bg-[#1E3A5F] hover:bg-blue-800 text-white"
                          } shadow-sm`}
                          title="Añadir al carrito"
                        >
                          <span className="text-lg leading-none">🛒</span>
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
      <aside
        className={`w-[400px] flex flex-col shadow-2xl z-40 ${
          isMounted ? "transition-colors duration-500" : "transition-none"
        } ${isDark ? "bg-[#111827] border-l border-white/5" : "bg-white border-l border-slate-200"}`}
      >
        <div
          className={`p-8 border-b ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/50"}`}
        >
          <div className="flex justify-between items-center">
            <h2
              className={`text-xl font-black ${isDark ? "text-white" : "text-slate-800"}`}
            >
              Detalle Venta
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCart([])}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
              >
                🗑️
              </button>
              <span className="text-xs bg-[#275791] text-white px-3 py-1 rounded-full font-bold">
                {cart.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.producto_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-2xl border transition-all ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}
              >
                <div className="flex justify-between items-start">
                  <p
                    className={`text-xs font-bold uppercase flex-1 ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    {item.nombre}
                  </p>
                  <span className="bg-blue-600/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-md font-black ml-2">
                    x{item.cantidad}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-slate-400 font-bold text-[10px]">
                    ${new Intl.NumberFormat("es-CL").format(item.precio)} u.
                  </p>
                  <p
                    className={`font-black text-sm ${isDark ? "text-blue-400" : "text-slate-900"}`}
                  >
                    $
                    {new Intl.NumberFormat("es-CL").format(
                      item.precio * item.cantidad,
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showConfirmModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Overlay de fondo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isProcessing && setShowConfirmModal(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />

              {/* Ventana Modal */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className={`relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl ${
                  isDark ? "bg-[#111827] border border-white/10" : "bg-white"
                }`}
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center text-2xl">
                      🧾
                    </div>
                    <div>
                      <h3
                        className={`text-xl font-black ${isDark ? "text-white" : "text-slate-800"}`}
                      >
                        Confirmar Venta
                      </h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Resumen de transacción
                      </p>
                    </div>
                  </div>

                  {/* Lista de productos resumida */}
                  <div
                    className={`max-h-60 overflow-y-auto mb-6 rounded-2xl p-4 ${isDark ? "bg-white/5" : "bg-slate-50"}`}
                  >
                    {cart.map((item) => (
                      <div
                        key={item.producto_id}
                        className="flex justify-between py-2 border-b last:border-0 border-slate-500/10"
                      >
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-bold ${isDark ? "text-slate-200" : "text-slate-700"}`}
                          >
                            {item.nombre}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {item.cantidad} x $
                            {new Intl.NumberFormat("es-CL").format(item.precio)}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-black ${isDark ? "text-blue-400" : "text-slate-900"}`}
                        >
                          $
                          {new Intl.NumberFormat("es-CL").format(
                            item.precio * item.cantidad,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-8 px-2">
                    <span className="text-sm font-bold text-slate-500 uppercase">
                      Total a Pagar
                    </span>
                    <span
                      className={`text-3xl font-black ${isDark ? "text-white" : "text-[#275791]"}`}
                    >
                      ${new Intl.NumberFormat("es-CL").format(totalCart)}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      disabled={isProcessing}
                      className={`flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                        isDark
                          ? "bg-white/5 text-slate-400 hover:bg-white/10"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmarVentaFinal}
                      disabled={isProcessing}
                      className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Confirmar y Pagar"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuccessModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              {/* Fondo oscuro */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Contenido del Éxito */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className={`relative w-full max-w-sm p-8 rounded-[40px] text-center shadow-2xl ${
                  isDark
                    ? "bg-[#111827] border border-emerald-500/20"
                    : "bg-white"
                }`}
              >
                {/* Ícono animado de Check */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.2 }}
                  className="w-24 h-24 bg-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-lg shadow-emerald-500/40"
                >
                  ✅
                </motion.div>

                <h3
                  className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-slate-800"}`}
                >
                  ¡Venta Exitosa!
                </h3>
                <p className="text-slate-500 text-sm font-medium mb-6">
                  La transacción se ha registrado correctamente en el sistema.
                </p>

                {/* Mini Resumen Final */}
                <div
                  className={`rounded-2xl p-4 mb-8 ${isDark ? "bg-white/5" : "bg-slate-50"}`}
                >
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    <span>Comprobante</span>
                    <span>Total</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-mono ${isDark ? "text-blue-400" : "text-blue-600"}`}
                    >
                      #{String(ultimaVenta?.id).padStart(6, "0")}
                    </span>
                    <span
                      className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      $
                      {new Intl.NumberFormat("es-CL").format(
                        ultimaVenta?.total || 0,
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/30 active:scale-95"
                >
                  Entendido
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div
          className={`p-8 ${isDark ? "bg-[#275791]" : "bg-[#111827]"} text-white rounded-t-[40px] shadow-2xl`}
        >
          <div className="flex justify-between items-end mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">
              Total Final
            </span>
            <span className="text-4xl font-black tracking-tighter">
              ${new Intl.NumberFormat("es-CL").format(totalCart)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
              isProcessing || cart.length === 0
                ? "bg-slate-500 cursor-not-allowed opacity-50"
                : isDark
                  ? "bg-white text-[#275791] hover:bg-slate-100"
                  : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                PROCESANDO...
              </>
            ) : (
              "PROCESAR PAGO"
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}
