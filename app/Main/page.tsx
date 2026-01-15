"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SalesPage() {
  const [cart, setCart] = useState([
    { id: 1, name: "Coca cola 3L", qty: 1, price: 1800 },
  ]);
  const router = useRouter();
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
      {/* 1. SIDEBAR IZQUIERDO (CATEGORÍAS) */}
      <aside className="w-64 bg-[#275791] flex flex-col p-4 shadow-xl">
        <h2 className="text-white text-2xl font-bold mb-8 text-center">
          MiniPOS MTZ
        </h2>

        <nav className="flex-1 space-y-3">
          {categories.map((cat, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 5 }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                cat.active
                  ? "bg-white text-[#275791]"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <span>{cat.name}</span>
              {cat.icon && <span>{cat.icon}</span>}
            </motion.button>
          ))}
        </nav>

        <button onClick={() => router.push("/login")} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors mt-auto">
          <span >⭕</span> Cerrar Sesión
        </button>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL (PRODUCTOS) */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        {/* Header Superior */}
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
            <button
              onClick={() => router.push("/historial")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#275791] rounded-lg hover:bg-[#1e4470] transition-all shadow-md shadow-blue-900/10 active:scale-95"
            >
              <span className="text-lg">📊</span>
              Historial de Ventas
            </button>
            <button
              onClick={() => router.push("/inventario")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#275791] rounded-lg hover:bg-[#1e4470] transition-all shadow-md shadow-blue-900/10 active:scale-95"
            >
              <span className="text-lg">📋</span>
              Inventario
            </button>

            <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
              <button className="relative text-slate-400 hover:text-[#275791] hover:bg-slate-100 p-2 rounded-full transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="flex items-center gap-3 ml-2">
                <div className="text-right hidden sm:block leading-tight">
                  <p className="text-xs font-bold text-slate-800 uppercase">
                    usuario
                  </p>
                  <p className="text-[10px] text-[#275791] font-semibold">
                    Administrador
                  </p>
                </div>
                <div className="w-10 h-10 bg-[#275791] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                  <span className="text-xl">👤</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Barra de Búsqueda */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-slate-200 border-none rounded-md py-2 px-10 focus:ring-2 focus:ring-[#275791] outline-none"
          />
          <span className="absolute left-3 top-2 text-gray-400">🔍</span>
          <button className="absolute right-3 top-1 bg-slate-300 px-3 py-1 rounded text-xs text-gray-600">
            Scan
          </button>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -5 }}
              className="bg-white p-4 rounded-xl border shadow-sm flex flex-col items-center text-center"
            >
              <div className="h-40 w-full relative mb-4">
                <Image
                  src="/images/Icono-login.png"
                  alt="Producto"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-bold text-lg">Coca cola 3L</h3>
              <p className="text-[#10b981] font-bold text-xl mb-4">$1.800</p>
              <button className="w-full bg-[#275791] text-white py-2 rounded-lg font-bold hover:bg-[#1e4470] transition-colors">
                Añadir al Carrito
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* 3. PANEL DE CHECKOUT (CARRITO) */}
      <aside className="w-80 bg-[#275791] text-white flex flex-col p-4 shadow-2xl">
        <h2 className="text-center text-xl font-bold mb-6 border-b border-white/20 pb-4">
          Checkout
        </h2>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase opacity-70">
                <th className="py-2">Producto</th>
                <th className="py-2 text-center">Cant.</th>
                <th className="py-2 text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="py-4 font-medium">{item.name}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs hover:bg-white/40">
                        +
                      </button>
                      <span>{item.qty}</span>
                      <button className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs hover:bg-white/40">
                        -
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-right font-bold text-[#10b981]">
                    ${item.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="mt-auto space-y-2 border-t border-white/20 pt-6">
          <div className="flex justify-between text-sm">
            <span>Descuento</span>
            <span>$1.800</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Sub-Total</span>
            <span>$1.800</span>
          </div>
          <div className="flex justify-between text-sm text-white/70">
            <span>IVA</span>
            <span>$1.800</span>
          </div>
          <div className="flex justify-between text-2xl font-bold mt-4">
            <span>Total</span>
            <span className="text-[#10b981]">$1.800</span>
          </div>
          <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl mt-4 text-lg shadow-lg transition-transform active:scale-95">
            Pagar Ahora
          </button>
        </div>
      </aside>
    </div>
  );
}
