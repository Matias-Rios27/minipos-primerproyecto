"use client";

import { useState } from "react"; // 1. Importamos useState
import { motion, AnimatePresence } from "framer-motion"; // 2. Agregamos AnimatePresence para animar la salida
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SalesPage() {
  const router = useRouter();

  // ESTADOS NUEVOS
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [cart, setCart] = useState([
    { id: 1, name: "Coca cola 3L", qty: 1, price: 1800 },
  ]);

  // SIMULACIÓN DE ALERTAS (Basado en tu lógica de stock y vencimiento)
  const [alertas, setAlertas] = useState([
    {
      id: 1,
      tipo: "stock",
      msj: "Coca Cola 3L: Stock crítico (2 un)",
      severidad: "alta",
    },
    {
      id: 2,
      tipo: "vencimiento",
      msj: "Yogurt Natural: Vence en 2 días",
      severidad: "media",
    },
  ]);

  const categories = [
    { name: "Todos los Articulos", active: true },
    { name: "Bebidas", icon: "🥤" },
    { name: "Alimentos", icon: "🍱" },
    { name: "Limpieza", icon: "🧼" },
    { name: "Cuidado Personal", icon: "🧴" },
    { name: "Electronicos", icon: "🔌" },
    { name: "Mascotas", icon: "🐱" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800 overflow-hidden">
      {/* 1. SIDEBAR IZQUIERDO */}
      <aside className="w-64 bg-[#275791] flex flex-col p-4 shadow-xl">
        {/* ... contenido del sidebar */}
        <h2 className="text-white text-2xl font-bold mb-8 text-center">
          MiniPOS MTZ
        </h2>
        <nav className="flex-1 space-y-3">
          {categories.map((cat, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 5 }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium ${cat.active ? "bg-white text-[#275791]" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              <span>{cat.name}</span>
              {cat.icon && <span>{cat.icon}</span>}
            </motion.button>
          ))}
        </nav>
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg mt-auto"
        >
          <span>⭕</span> Cerrar Sesión
        </button>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center top-0 z-30 shadow-sm mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#275791] tracking-tight">
              Nombre del emprendimiento
            </h1>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
              <span className="text-blue-500">📍</span> Quilicura, Santiago
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* BOTONES DE NAVEGACIÓN */}
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/historial")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#275791] rounded-lg hover:bg-[#1e4470] transition-all shadow-md active:scale-95"
              >
                <span className="text-lg">📊</span> Historial
              </button>
              <button
                onClick={() => router.push("/inventario")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#275791] rounded-lg hover:bg-[#1e4470] transition-all shadow-md active:scale-95"
              >
                <span className="text-lg">📋</span> Inventario
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#275791] rounded-lg hover:bg-[#1e4470] transition-all shadow-md active:scale-95"
              >
                <span className="text-lg">📈</span> Dashboard
              </button>
            </div>

            {/* SECCIÓN DE NOTIFICACIONES Y USUARIO */}
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200 relative">
              {/* CAMPANA CON SUBMENÚ */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificaciones(!showNotificaciones)}
                  className={`relative p-2 rounded-full transition-colors ${showNotificaciones ? "bg-slate-100 text-[#275791]" : "text-slate-400 hover:text-[#275791] hover:bg-slate-100"}`}
                >
                  <span className="text-xl">🔔</span>
                  {alertas.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </button>

                {/* MENU DESPLEGABLE DE ALERTAS */}
                <AnimatePresence>
                  {showNotificaciones && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                    >
                      <div className="bg-[#275791] p-4 text-white flex justify-between items-center">
                        <h4 className="text-[10px] font-black uppercase tracking-widest">
                          Alertas de Inventario
                        </h4>
                        <span className="bg-red-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {alertas.length}
                        </span>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {alertas.length > 0 ? (
                          alertas.map((alerta) => (
                            <div
                              key={alerta.id}
                              className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 items-start"
                            >
                              <div
                                className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${alerta.tipo === "stock" ? "bg-orange-500" : "bg-red-500"}`}
                              ></div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">
                                  {alerta.tipo === "stock"
                                    ? "⚠️ STOCK BAJO"
                                    : "📅 VENCIMIENTO"}
                                </p>
                                <p className="text-xs font-bold text-slate-700 leading-tight">
                                  {alerta.msj}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center text-slate-400 text-xs font-medium">
                            No hay alertas pendientes
                          </div>
                        )}
                      </div>
                      <button className="w-full py-3 text-[10px] font-black text-[#275791] bg-slate-50 hover:bg-slate-100 uppercase tracking-widest">
                        Gestionar Alertas
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PERFIL DE USUARIO */}
              <div className="flex items-center gap-3 ml-2">
                <div className="text-right hidden sm:block leading-tight">
                  <p className="text-xs font-bold text-slate-800 uppercase">
                    usuario
                  </p>
                  <p className="text-[10px] text-[#275791] font-semibold">
                    Administrador
                  </p>
                </div>
                <div className="w-10 h-10 bg-[#275791] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer overflow-hidden">
                  <span className="text-xl">👤</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* BUSCADOR */}
        <div className="relative mb-8 group">
          <input
            type="text"
            placeholder="Buscar producto por nombre o código..."
            className="w-full bg-white border-2 border-transparent rounded-xl py-3 px-12 focus:border-[#275791] focus:bg-white shadow-sm transition-all outline-none"
          />
          <span className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-[#275791] transition-colors text-lg">
            🔍
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-3 top-2 bg-[#275791]/10 text-[#275791] px-4 py-1.5 rounded-lg text-md font-black uppercase tracking-widest"
          >
            Scan
          </motion.button>
        </div>

        {/* GRID DE PRODUCTOS CON ANIMACIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <motion.div
              key={item}
              layout
              whileHover={{
                y: -8,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
              }}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center group relative overflow-hidden"
            >
              <div className="h-40 w-full bg-slate-50 rounded-xl mb-4 relative flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <span className="text-4xl opacity-20 group-hover:scale-110 transition-transform duration-300">
                  📦
                </span>
              </div>
              <h3 className="font-bold text-slate-800">Coca Cola 3L</h3>
              <p className="text-[#10b981] font-black text-xl mt-1">$1.800</p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-[#275791] text-white py-3 rounded-xl mt-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:bg-[#1e4470]"
              >
                Añadir al Carrito
              </motion.button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* 3. PANEL DE CHECKOUT */}
      <aside className="w-80 bg-[#275791] text-white flex flex-col p-4 shadow-2xl">
        {/* ... contenido del checkout */}
        <h2 className="text-center text-xl font-bold mb-6 border-b border-white/20 pb-4">
          Checkout
        </h2>
        <div className="flex-1 overflow-y-auto">{/* Tabla de items */}</div>
        <div className="mt-auto pt-6 border-t border-white/20 space-y-4">
          <div className="flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span className="text-[#10b981]">$1.800</span>
          </div>
          <button className="w-full bg-[#10b981] text-white font-bold py-4 rounded-xl text-lg shadow-lg">
            Pagar Ahora
          </button>
        </div>
      </aside>
    </div>
  );
}
