"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SalesHistoryPage() {
  const router = useRouter();
  const sales = [
    { 
      id: "001", 
      details: ["Coca cola 3L", "Coca cola 3L", "Coca cola 3L"], 
      date: "13/01/2025 15:01", 
      total: 6800 
    },
    { 
      id: "002", 
      details: ["Coca cola 3L", "Fanta 3L"], 
      date: "13/01/2025 16:30", 
      total: 4500 
    },
    { 
      id: "003", 
      details: ["Pack Galletas", "Leche entera"], 
      date: "14/01/2025 09:15", 
      total: 3200 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* NAVBAR MODERNO */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#275791] tracking-tight">Historial de ventas</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Reporte detallado de transacciones</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/Main")}
              className="px-4 py-2 text-sm font-bold text-white bg-[#275791] rounded-lg hover:bg-[#1e4470] transition-all shadow-md active:scale-95"
            >
              🏠 Ir al Inicio
            </button>
            <button 
              onClick={() => router.push("/inventario")}
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all border border-slate-200 flex items-center gap-2"
            >
              📋 Inventario
            </button>
          </div>
          
          <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
            <span className="text-xl cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors">🔔</span>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 uppercase leading-none">usuario</p>
                <p className="text-[10px] text-[#275791] font-medium">Administrador</p>
              </div>
              <div className="w-10 h-10 bg-[#275791] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white">
                👤
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* BARRA DE BÚSQUEDA Y FILTRO */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#275791] transition-colors">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por ID de venta o producto..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-[#275791] outline-none transition-all"
            />
          </div>
          <button className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-slate-600 flex items-center gap-2 font-bold">
            <span className="text-xl">⏳</span> Filtrar por Fecha
          </button>
        </div>

        {/* TABLA DE VENTAS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#275791] text-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-16 text-center">✅</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">ID Venta</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Detalle de la venta</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Accion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.map((sale, i) => (
                <motion.tr 
                  key={sale.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500 rounded border-slate-300" defaultChecked />
                  </td>
                  <td className="px-6 py-4 font-bold text-[#275791]">#{sale.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      {sale.details.map((item, idx) => (
                        <span key={idx} className="text-sm text-slate-700 font-medium">• {item}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                      {sale.date}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-emerald-600">
                      ${sale.total.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-end">
                      <button className="bg-[#275791] text-white text-[10px] font-bold px-4 py-1.5 rounded-md hover:bg-emerald-600 transition-colors w-24">
                        AGREGAR
                      </button>
                      <button className="bg-red-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-md hover:bg-red-600 transition-colors w-24">
                        ELIMINAR
                      </button>
                      <button className="bg-slate-700 text-white text-[10px] font-bold px-4 py-1.5 rounded-md hover:bg-black transition-colors w-24">
                        IR A VER
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RESUMEN RÁPIDO AL FINAL */}
        <div className="mt-8 flex justify-end">
          <div className="bg-[#275791] p-6 rounded-2xl text-white shadow-xl flex gap-12 items-center">
            <div className="text-center">
              <p className="text-xs opacity-70 uppercase font-bold tracking-widest">Ventas Hoy</p>
              <p className="text-3xl font-black">12</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <p className="text-xs opacity-70 uppercase font-bold tracking-widest">Total Recaudado</p>
              <p className="text-3xl font-black text-emerald-400">$14.500</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}