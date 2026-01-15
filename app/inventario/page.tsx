"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();
  
  const products = [
    { id: 1, name: "Coca cola 3L", category: "Bebidas", price: 1800, cost: 1500, provider: "TAL TAL", image: "/images/Icono-login.png" },
    { id: 2, name: "Coca cola 3L", category: "Bebidas", price: 1800, cost: 1500, provider: "TAL TAL", image: "/images/Icono-login.png" },
    { id: 3, name: "Coca cola 3L", category: "Bebidas", price: 1800, cost: 1500, provider: "TAL TAL", image: "/images/Icono-login.png" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER SUPERIOR */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[#275791] tracking-tight">Gestión de productos</h1>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push("/Main")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#275791] rounded-lg hover:bg-[#1e4470] transition-all shadow-md active:scale-95"
          >
            🏠 Ir al Inicio
          </button>
          
          <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
            <span className="text-xl cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors">🔔</span>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 uppercase leading-none">usuario</p>
                <p className="text-[10px] text-[#275791] font-medium">Administrador</p>
              </div>
              <div className="w-10 h-10 bg-[#275791] rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white overflow-hidden">
                <span className="text-xl">👤</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* BARRA DE ACCIONES */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <div className="flex-1 min-w-[300px] relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por nombre, categoría o proveedor..." 
              className="w-full pl-11 pr-24 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#275791] focus:border-transparent outline-none transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1">
              📷 SCAN
            </button>
          </div>

          <div className="flex gap-3">
            <button className="bg-[#275791] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1e4470] shadow-lg shadow-blue-900/10 transition-all active:scale-95">
              ➕ Agregar producto
            </button>
            <button className="bg-white text-[#275791] border-2 border-[#275791] px-5 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95">
              📞 Proveedores
            </button>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS ESTILO MODERNO */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#275791] text-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Precio</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Costo</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p, i) => (
                <motion.tr 
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-slate-200 group-hover:scale-110 transition-transform">
                      <Image src={p.image} alt={p.name} width={40} height={40} className="object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{p.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-[#275791] px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-600">${p.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center font-medium text-slate-500">${p.cost.toLocaleString()}/u</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{p.provider}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push("/editarproducto")}  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        ✏️
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        🗑️
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}