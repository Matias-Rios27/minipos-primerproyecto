"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DetalleVentaPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR (TU CÓDIGO ORIGINAL - NO TOCAR) */}
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-8 max-w-[1400px] mx-auto">
        
        {/* Encabezado de la Sección */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <button onClick={() => router.back()} className="text-[#275791] font-bold flex items-center gap-2 mb-1 hover:underline text-sm">
              ← Volver al historial
            </button>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Detalle de Operación</h2>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              📥 EXPORTAR PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#275791] rounded-lg text-xs font-black text-white hover:bg-[#1a3d66] transition-all shadow-lg shadow-blue-900/10">
              🖨️ IMPRIMIR RECIBO
            </button>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL AZUL */}
        <div className="bg-[#275791] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-12 min-h-[500px]">
          
          {/* 1. INFO DE VENTA (IZQUIERDA) */}
          <div className="col-span-12 lg:col-span-3 p-8 border-r border-black/10 flex flex-col justify-between bg-black/5">
            <div className="text-white space-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300/80 mb-1">Folio Interno</p>
                <h3 className="text-5xl font-black italic tracking-tighter">#001</h3>
              </div>
              
              <div className="space-y-5">
                <div className="pb-4 border-b border-white/10">
                  <p className="text-[10px] font-black uppercase text-blue-300/80">Fecha de Venta</p>
                  <p className="text-xl font-bold">13 de Enero, 2026</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-blue-300/80">Hora de Registro</p>
                  <p className="text-xl font-bold">15:01:45</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button className="w-full bg-white text-[#275791] font-black py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-md">
                Editar Venta
              </button>
              <button className="w-full bg-red-500/20 text-red-200 border border-red-500/30 font-black py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-red-500/40 transition-all">
                Anular Venta
              </button>
            </div>
          </div>

          {/* 2. ARTICULOS EN FILA (CENTRO) */}
          <div className="col-span-12 lg:col-span-6 p-8 border-r border-black/10">
            <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-center">Artículos en el listado</h4>
            
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
              {/* FILA DE PRODUCTO 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white rounded-xl p-2 flex-shrink-0 shadow-lg group-hover:rotate-3 transition-transform">
                    <Image src="/images/coca.png" alt="Coca" width={64} height={64} className="object-contain" />
                  </div>
                  <div className="text-white">
                    <p className="text-lg font-black leading-none">Coca cola 3L</p>
                    <p className="text-[10px] font-bold text-blue-300 mt-1 uppercase tracking-wider underline underline-offset-4">Bebidas y Licores</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white/50 uppercase">Cantidad</p>
                  <p className="text-2xl font-black text-white leading-none">03</p>
                </div>
              </div>

              {/* PUEDES REPETIR ESTA ESTRUCTURA PARA OTROS PRODUCTOS */}
            </div>
          </div>

          {/* 3. RESUMEN CHECKOUT (DERECHA) */}
          <div className="col-span-12 lg:col-span-3 p-8 flex flex-col justify-between bg-black/10">
            <div>
              <h4 className="text-center font-black text-xs uppercase tracking-[0.3em] text-white/50 mb-8 border-b border-white/5 pb-4">Consolidado</h4>
              
              <div className="space-y-4 px-2">
                <div className="flex justify-between items-center group cursor-default">
                  <span className="text-white/60 font-bold text-xs uppercase group-hover:text-white transition-colors">Sub-Total</span>
                  <span className="text-white font-bold">$1.800</span>
                </div>
                <div className="flex justify-between items-center group cursor-default">
                  <span className="text-white/60 font-bold text-xs uppercase group-hover:text-white transition-colors">Impuestos</span>
                  <span className="text-white font-bold">$1.800</span>
                </div>
                <div className="flex justify-between items-center group cursor-default">
                  <span className="text-emerald-400 font-bold text-xs uppercase">Descuentos</span>
                  <span className="text-emerald-400 font-bold">-$0</span>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-white/40 font-black text-[10px] uppercase tracking-widest leading-none">Total Neto</span>
                  <span className="text-white font-black text-base">Venta Final</span>
                </div>
                <span className="text-5xl font-black text-[#00df82] leading-none tracking-tighter drop-shadow-[0_4px_10px_rgba(0,223,130,0.3)]">$5.400</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}