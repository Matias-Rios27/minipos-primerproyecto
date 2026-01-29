"use client";

import { useRouter } from "next/navigation";

export default function BalancePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR ESTÁNDAR - MANTENIDO SEGÚN TU DISEÑO */}
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

      {/* CONTENIDO DE BALANCE */}
      <main className="p-8 max-w-7xl mx-auto">
        {/* Título y Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Balance Financiero</h2>
            <p className="text-sm text-slate-500 font-medium italic">Análisis de rentabilidad: Ingresos vs Egresos</p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-[#275791] text-white rounded-lg">Exportar Excel</button>
            <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">Imprimir PDF</button>
          </div>
        </div>

        {/* BLOQUE 1: TARJETAS DE ESTADO FINANCIERO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-7 rounded-3xl border-l-[12px] border-emerald-500 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Ingresos Brutos</p>
            <h3 className="text-4xl font-black text-emerald-600 mt-2">+$5.400.000</h3>
            <p className="text-[10px] mt-4 text-slate-400 font-bold bg-slate-100 inline-block px-2 py-1 rounded">Origen: Ventas POS</p>
          </div>

          <div className="bg-white p-7 rounded-3xl border-l-[12px] border-red-500 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Gastos Totales</p>
            <h3 className="text-4xl font-black text-red-600 mt-2">-$1.240.500</h3>
            <p className="text-[10px] mt-4 text-slate-400 font-bold bg-slate-100 inline-block px-2 py-1 rounded">Origen: Operativo / Gastos</p>
          </div>

          <div className="bg-[#275791] p-7 rounded-3xl shadow-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em]">Utilidad Neta Esperada</p>
              <h3 className="text-4xl font-black mt-2 text-[#00df82] drop-shadow-md">$4.159.500</h3>
              <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div className="bg-[#00df82] h-full w-[77%] shadow-[0_0_15px_rgba(0,223,130,0.5)]"></div>
              </div>
              <p className="text-[10px] mt-3 font-bold opacity-70">Margen de ganancia: 77%</p>
            </div>
            <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 font-black">Σ</div>
          </div>
        </div>

        {/* BLOQUE 2: COMPARATIVA MENSUAL */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm mb-10">
          <h4 className="font-black text-slate-800 uppercase text-xs tracking-[0.3em] mb-10 text-center">Solvencia de Caja: Comparativa Ingresos vs Gastos</h4>
          
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Mes de Ejemplo */}
            <div className="flex items-center gap-6 group">
              <span className="text-xs font-black w-24 uppercase text-slate-400 group-hover:text-[#275791] transition-colors tracking-tighter">Enero 2026</span>
              <div className="flex-1 h-12 flex rounded-2xl overflow-hidden shadow-inner bg-slate-50 border border-slate-100 p-1">
                <div className="bg-emerald-500 w-[80%] flex items-center justify-center text-[10px] font-black text-white rounded-xl mr-0.5 shadow-lg">INGRESOS</div>
                <div className="bg-red-500 w-[20%] flex items-center justify-center text-[10px] font-black text-white rounded-xl shadow-lg">GASTOS</div>
              </div>
              <div className="w-24 text-right">
                <span className="text-sm font-black text-slate-800 block leading-none">$5.4M</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Saludable</span>
              </div>
            </div>
            {/* Aquí podrías mapear otros meses */}
          </div>
        </div>

        {/* BLOQUE 3: DISTRIBUCIÓN POR CATEGORÍA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-[#275791] border-b pb-4">Desglose de Egresos por Categoría</h5>
            <ul className="space-y-5">
              <li className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">🏠</div>
                  <span className="text-sm font-black text-slate-700 group-hover:text-[#275791] transition-colors">Servicios Básicos</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-800 block">$120.000</span>
                  <span className="text-[10px] font-bold text-slate-400">9.6% del total</span>
                </div>
              </li>
              <li className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">🚚</div>
                  <span className="text-sm font-black text-slate-700 group-hover:text-[#275791] transition-colors">Abastecimiento</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-800 block">$980.500</span>
                  <span className="text-[10px] font-bold text-slate-400">79.2% del total</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-[#1e4470] p-10 rounded-3xl flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-white/20">
                <span className="text-2xl">💡</span>
              </div>
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">Recomendación Estratégica</p>
              <p className="text-lg font-medium text-white leading-relaxed italic">
                "Tus gastos en abastecimiento representan el mayor peso. <span className="text-[#00df82] font-black underline">Negociar con proveedores</span> este trimestre podría aumentar tu utilidad neta en un 4%."
              </p>
            </div>
            {/* Decoración geométrica */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          </div>
        </div>
      </main>
    </div>
  );
}