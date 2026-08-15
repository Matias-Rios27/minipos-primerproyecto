"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getProducts, getNotificaciones, deleteNotificacion, createVenta } from "@/lib/api";
import { Producto, Alerta, CartItem, VentaExitosa } from "@/types/types";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ventaExitosaInfo, setVentaExitosaInfo] = useState<VentaExitosa | null>(
    null,
  );
  const [ultimaVenta, setUltimaVenta] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const generarPDFBoleta = (
    idVenta: number,
    total: number,
    productos: any[],
  ) => {
    const doc = new jsPDF({ unit: "mm", format: [80, 150] }); // Formato ticket térmico

    // Encabezado
    doc.setFontSize(10);
    doc.text("MINI POS - MTZ", 40, 10, { align: "center" });
    doc.setFontSize(7);
    doc.text("Quilicura, Santiago", 40, 14, { align: "center" });
    doc.text(`Venta: #V-${idVenta.toString().padStart(4, "0")}`, 10, 22);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 10, 26);

    // Tabla de productos
    const tableData = productos.map((item) => [
      item.nombre.substring(0, 15),
      item.cantidad,
      `$${(item.precio * item.cantidad).toLocaleString("es-CL")}`,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Prod", "Cant", "Sub"]],
      body: tableData,
      theme: "plain",
      styles: { fontSize: 6, cellPadding: 1 },
      headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: $${total.toLocaleString("es-CL")}`, 70, finalY, {
      align: "right",
    });

    doc.setFontSize(7);
    doc.text("¡Gracias por su compra!", 40, finalY + 10, { align: "center" });

    doc.save(`Boleta_${idVenta}.pdf`);
  };

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
    const storedUser =
      localStorage.getItem("user_name") ||
      sessionStorage.getItem("user_name") ||
      "Admin";

    // 1. Aquí obtienes el ID
    const storedId =
      localStorage.getItem("user_id") || sessionStorage.getItem("user_id");

    // 2. CORRECCIÓN: Debes guardar ese ID en el estado del componente
    if (storedId) {
      setUserId(Number(storedId));
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    setIsDark(isCurrentlyDark);

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
  }, [router]);

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
        if (existingItem.cantidad >= product.stock) {
          alert(`⚠️ No puedes agregar más unidades. El stock máximo disponible es ${product.stock} unids.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.producto_id === product.producto_id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      if (product.stock <= 0) {
        alert("⚠️ Este producto no tiene stock disponible.");
        return prevCart;
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const updateCartQuantity = (producto_id: number, delta: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.producto_id === producto_id);
      if (!existing) return prevCart;

      const newQty = existing.cantidad + delta;
      if (newQty <= 0) {
        return prevCart.filter((item) => item.producto_id !== producto_id);
      }

      if (delta > 0 && newQty > existing.stock) {
        alert(`⚠️ No puedes superar el stock máximo disponible (${existing.stock} unids).`);
        return prevCart;
      }

      return prevCart.map((item) =>
        item.producto_id === producto_id ? { ...item, cantidad: newQty } : item
      );
    });
  };

  const totalCart = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const handleLogout = () => {
    // Limpieza total
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user_name");
    sessionStorage.removeItem("user_id");

    // Redirigir al inicio
    router.push("/");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowConfirmModal(true);
  };

  const confirmarVentaFinal = async () => {
    try {
      setIsProcessing(true);
      const idDesdeStorage =
        localStorage.getItem("user_id") || sessionStorage.getItem("user_id");
      const activeUserId = Number(idDesdeStorage);

      if (!activeUserId) {
        alert("Error de sesión");
        return;
      }

      // Guardamos una COPIA del carrito para la boleta antes de borrarlo
      const copiaCarritoParaBoleta = [...cart];
      const totalVentaCopia = totalCart;

      const ventaData = {
        usuario_id: activeUserId,
        total: totalCart,
        items: cart.map((item) => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad,
        })),
      };

      const response = await createVenta(ventaData);

      // Actualizamos inmediatamente el stock en el estado local
      setProducts((prev) =>
        prev.map((p) => {
          const itemVendido = copiaCarritoParaBoleta.find((item) => item.producto_id === p.producto_id);
          if (itemVendido) {
            return { ...p, stock: Math.max(0, p.stock - itemVendido.cantidad) };
          }
          return p;
        })
      );

      // Sincronizamos con la base de datos de Neon
      try {
        const freshProducts = await getProducts();
        if (Array.isArray(freshProducts)) {
          setProducts(freshProducts);
        }
      } catch (e) {
        console.error("Error refrescando productos desde BD:", e);
      }

      // IMPORTANTE: Guardamos la info que devuelve el servidor
      setVentaExitosaInfo({
        id: response.id || response.venta_id,
        total: totalVentaCopia,
        items: copiaCarritoParaBoleta,
      });

      setCart([]);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Error en la venta:", error);
      alert("Error al procesar la venta.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDeleteNotificacion = async (id: number) => {
    try {
      await deleteNotificacion(id);
      setAlertas(prev => prev.filter(a => a.notificacion_id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div
        className={`flex h-screen font-sans overflow-hidden ${
          isMounted ? "transition-colors duration-500" : "transition-none"
        } ${isDark ? "bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}
      >
        {/* 1. SIDEBAR IZQUIERDO */}
        <aside
          className={`w-72 flex flex-col shadow-2xl z-40 ${
            isMounted ? "transition-colors duration-500" : "transition-none"
          } ${isDark ? "bg-[#111827e] border-r border-white/5" : "bg-white border-r border-slate-200"}`}
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
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* 2. CONTENIDO PRINCIPAL */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Navbar activePage="pos" />

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
                      Mascotas: 7,
                    };
                    const matchesCategory =
                      selectedCategory === "Todos los Artículos" ||
                      p.categoria_id === categoryMap[selectedCategory];
                    return isVisible && matchesSearch && matchesCategory;
                  })
                  .map((product) => {
                    const itemEnCarrito = cart.find((item) => item.producto_id === product.producto_id);
                    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
                    const stockRestante = Math.max(0, product.stock - cantidadEnCarrito);
                    const estaAgotado = stockRestante <= 0;

                    return (
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
                            <div className="flex flex-col items-center opacity-30 text-slate-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              <span className="text-[10px] font-bold mt-2 uppercase tracking-wider">
                                Sin Imagen
                              </span>
                            </div>
                          )}

                          {/* ETIQUETA DE STOCK DINÁMICO */}
                          <div className="absolute top-3 right-3">
                            <span
                              className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg border backdrop-blur-md ${
                                estaAgotado
                                  ? "bg-rose-500/20 text-rose-500 border-rose-500/30"
                                  : stockRestante > (product.stock_minimo || 0)
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {stockRestante} UNID.
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
                                  Mascotas: 7,
                                };
                                return (
                                  categoryMap[c.name] === product.categoria_id
                                );
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
                              disabled={estaAgotado}
                              onClick={() => addToCart(product)}
                              className={`p-2.5 rounded-xl transition-all ${
                                estaAgotado
                                  ? "bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                  : isDark
                                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                                    : "bg-[#1E3A5F] hover:bg-blue-800 text-white shadow-sm"
                              }`}
                              title={estaAgotado ? "Sin stock disponible" : "Añadir al carrito"}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
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
                              {new Intl.NumberFormat("es-CL").format(
                                item.precio,
                              )}
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
            {showSuccessModal && ventaExitosaInfo && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div
                  className={`relative w-full max-w-sm p-8 rounded-[40px] text-center border shadow-2xl ${
                    isDark
                      ? "bg-[#111827] border-emerald-500/20"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-4xl mb-6">
                    ✅
                  </div>

                  <h2
                    className={`text-2xl font-black mb-2 italic ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    ¡Venta Exitosa!
                  </h2>

                  <div
                    className={`rounded-3xl p-6 mb-8 border ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase">
                        Comprobante
                      </span>
                      <span className="text-sm font-bold text-blue-500">
                        #v-{ventaExitosaInfo.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-black text-slate-500 uppercase">
                        Pagado
                      </span>
                      <span
                        className={`text-3xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        ${ventaExitosaInfo.total.toLocaleString("es-CL")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() =>
                        generarPDFBoleta(
                          ventaExitosaInfo.id,
                          ventaExitosaInfo.total,
                          ventaExitosaInfo.items,
                        )
                      }
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest"
                    >
                      📄 Descargar Boleta Detail
                    </button>
                    <button
                      onClick={() => setShowSuccessModal(false)}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl text-xs uppercase tracking-widest"
                    >
                      Listo
                    </button>
                  </div>
                </div>
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
    </ProtectedRoute>
  );
}
