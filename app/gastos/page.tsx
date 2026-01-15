"use client"

import {useRouter} from "next/navigation";

export default function GestionGastosPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR ESTANDAR */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#275791] tracking-tight">Historial de ventas</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">Reporte detallado de Transacciones</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-sm font-bold text-white bg-[#275791] rounded-lg hover:bg-[#1e4470] transition-all shadow-md active:scale-95">
              Ir al Inicio
            </button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all border border-slate-200 flex items-center gap-2">
              Inventario
            </button>
          </div>
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
      </header>
      <main className="max-w-7xl mx-auto p-8">
        {/* Título y Buscador */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter border-l-8 border-[#275791] pl-4">
            Gestión de gastos
          </h2>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-2.5 opacity-30">🔍</span>
              <input 
                type="text" 
                placeholder="Buscar gasto..." 
                className="bg-slate-200/50 border-none rounded-md px-10 py-2 w-64 text-sm outline-none focus:ring-2 focus:ring-[#275791]/20 transition-all"
              />
            </div>
            <button className="p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
              <span className="grayscale">⏳</span>
            </button>
          </div>
        </div>
        {/* Tabla de Gastos */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Encabezado Azul */}
          <div className="bg-[#275791] text-white grid grid-cols-5 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">
            <span>Gasto</span>
            <span>Descripción</span>
            <span className="text-center">Fecha</span>
            <span className="text-center">Monto</span>
            <span className="text-right">Accion</span>
          </div>

          {/* Fila de Datos (Repetible) */}
          <div className="grid grid-cols-5 px-6 py-4 items-center border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <span className="font-black text-slate-700">Agua</span>
            <span className="text-sm font-bold text-slate-900">Cuenta del agua</span>
            <span className="text-sm font-black text-slate-800 text-center">14-01-2025</span>
            <span className="text-lg font-black text-slate-800 text-center">$54.482</span>
            
            <div className="flex flex-col gap-1 items-end">
              <button className="w-24 py-1.5 bg-[#1e4470] text-white text-[10px] font-black rounded uppercase hover:bg-red-600 transition-all">
                Eliminar
              </button>
              <button className="w-24 py-1.5 bg-[#275791] text-white text-[10px] font-black rounded uppercase hover:opacity-80 transition-all">
                Ir a Pagar
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
    
  )
}
