"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const [status, setStatus] = useState("active");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER SUPERIOR */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-[#275791]"
          >
            <span className="text-2xl font-bold">←</span>
          </button>
          <h1 className="text-2xl font-bold text-[#275791] tracking-tight">Editar producto</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-sm font-bold text-white bg-[#275791] rounded-lg hover:bg-[#1e4470] transition-all shadow-md">
              Ir al Inicio
            </button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all border border-slate-200">
              📋 Inventario
            </button>
          </div>
          
          <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
            <span className="text-xl cursor-pointer">🔔</span>
            <div className="w-10 h-10 bg-[#275791] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white">
              <span className="text-xl">👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto bg-[#275791] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white/10"
        >
          {/* LADO IZQUIERDO: IMAGEN DEL PRODUCTO */}
          <div className="w-full md:w-1/2 bg-white/5 flex items-center justify-center p-12 relative border-r border-white/10">
             <div className="relative w-full aspect-square bg-white rounded-2xl shadow-inner flex items-center justify-center p-8 group overflow-hidden">
                <Image 
                  src="/images/Icono-login.png" 
                  alt="Producto" 
                  width={350} 
                  height={350} 
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute bottom-4 right-4 bg-slate-800/80 text-white p-3 rounded-xl backdrop-blur-sm hover:bg-black transition-all">
                  📷 Cambiar Foto
                </button>
             </div>
          </div>

          {/* LADO DERECHO: FORMULARIO */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="col-span-2 space-y-2">
                <label className="text-blue-100 text-sm font-bold uppercase tracking-wider">Nombre del Producto</label>
                <input type="text" defaultValue="Coca cola 3L" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all placeholder:text-white/30" />
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <label className="text-blue-100 text-sm font-bold uppercase tracking-wider">Categoría</label>
                <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all appearance-none cursor-pointer">
                  <option className="text-black">Bebidas</option>
                  <option className="text-black">Alimentos</option>
                </select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <label className="text-blue-100 text-sm font-bold uppercase tracking-wider">Estado de Stock</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setStatus("active")}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${status === "active" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-900/40" : "bg-white/10 text-white/50 hover:bg-white/20"}`}
                  >
                    ACTIVO
                  </button>
                  <button 
                    onClick={() => setStatus("out")}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${status === "out" ? "bg-red-500 text-white shadow-lg shadow-red-900/40" : "bg-white/10 text-white/50 hover:bg-white/20"}`}
                  >
                    AGOTADO
                  </button>
                </div>
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <label className="text-blue-100 text-sm font-bold uppercase tracking-wider">Precio Venta</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">$</span>
                  <input type="number" defaultValue="1800" className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white font-bold text-xl focus:ring-2 focus:ring-emerald-400 outline-none" />
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="text-blue-100 text-sm font-bold uppercase tracking-wider">Stock Disponible</label>
                <input type="number" defaultValue="24" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 outline-none" />
              </div>

              {/* Fechas */}
              <div className="space-y-2">
                <label className="text-blue-100 text-sm font-bold uppercase tracking-wider">Fecha Agregado</label>
                <input type="date" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-blue-100 text-sm font-bold uppercase tracking-wider">Vencimiento</label>
                <input type="date" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none" />
              </div>

              {/* Proveedor */}
              <div className="col-span-2 space-y-2">
                <label className="text-blue-100 text-sm font-bold uppercase tracking-wider">Proveedor Principal</label>
                <input type="text" defaultValue="TAL TAL DISTRIBUIDORA" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex gap-4 mt-12">
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                🗑️ Eliminar Producto
              </button>
              <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                ✅ Guardar Cambios
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}