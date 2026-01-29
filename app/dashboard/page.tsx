"use client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR ESTÁNDAR (Mantener el que ya tienes) */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#275791] tracking-tight">
            Gestión de productos
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Añadir nuevo artículo al inventario
          </p>
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
            <span className="text-xl cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors">
              🔔
            </span>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 uppercase leading-none">
                  usuario
                </p>
                <p className="text-[10px] text-[#275791] font-medium">
                  Administrador
                </p>
              </div>
              <div className="w-10 h-10 bg-[#275791] rounded-full border-2 border-white shadow-md flex items-center justify-center text-white">
                👤
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
              Dashboard Operativo
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Resumen de rendimiento Semanal - Mensual
            </p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <button className="px-4 py-1.5 text-xs font-bold bg-[#275791] text-white rounded-md">
              Semana
            </button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-md">
              Mes
            </button>
          </div>
        </div>

        {/* SECCIÓN 1: TARJETAS DE INFORMACIÓN (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Tarjeta: Total Ventas */}
          <div className="bg-[#275791] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                Total Compras
              </p>
              <h3 className="text-4xl font-black mt-1">68</h3>
              <p className="text-xs mt-4 flex items-center gap-1 text-emerald-400 font-bold">
                ▲ +12%{" "}
                <span className="text-white/50 font-medium">
                  vs mes anterior
                </span>
              </p>
            </div>
            <span className="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 transition-transform">
              💰
            </span>
          </div>

          {/* Tarjeta: Productos Vendidos */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Productos Vendidos
            </p>
            <h3 className="text-4xl font-black mt-1 text-slate-800">238</h3>
            <p className="text-xs mt-4 text-[#275791] font-bold">
              Promedio: 34 p/día
            </p>
          </div>

          {/* Tarjeta: Gastos Registrados */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Gastos Totales
            </p>
            <h3 className="text-4xl font-black mt-1 text-red-500">$145.200</h3>
            <p className="text-xs mt-4 text-slate-500 font-medium">
              8 Facturas pendientes
            </p>
          </div>

          {/* Tarjeta: Balance Directo */}
          <div
            className="bg-emerald-500 p-6 rounded-2xl shadow-xl text-white cursor-pointer hover:bg-emerald-600 transition-all shadow-emerald-900/20"
            onClick={() => router.push("/balance")}
          >
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
              Estado de Balance
            </p>
            <h3 className="text-3xl font-black mt-1">Ver Reporte</h3>
            <p className="text-xs mt-4 flex items-center gap-2 font-bold">
              Ir a la página de balance ➜
            </p>
          </div>
        </div>

        {/* AQUÍ SIGUEN LOS GRÁFICOS (Paso 2) */}
        {/* SECCIÓN 2: GRÁFICOS PRINCIPALES */}
        <div className="grid grid-cols-12 gap-6">
          {/* Gráfico de Flujo de Caja (Ventas vs Gastos) */}
          <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">
                Flujo de Ingresos vs Gastos
              </h4>
              <div className="flex gap-4 text-[10px] font-bold">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>{" "}
                  Ingresos
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div> Gastos
                </span>
              </div>
            </div>

            {/* Espacio para el gráfico */}
            <div className="h-72 w-full bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200">
              <p className="text-slate-400 text-xs italic font-medium">
                [ Gráfico Lineal de Tendencia Mensual ]
              </p>
            </div>
          </div>

          {/* Gráfico Circular: Métodos de Pago o Categorías */}
          <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6 text-center">
              Día más concurrido
            </h4>
            <div className="h-48 w-48 mx-auto bg-slate-50 rounded-full border-8 border-blue-100 flex items-center justify-center relative">
              <div className="text-center">
                <p className="text-2xl font-black text-[#275791]">62%</p>
                <p className="text-[10px] font-bold text-slate-400">SÁBADO</p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold border-b pb-2">
                <span className="text-slate-500">Lunes - Viernes</span>{" "}
                <span>25.5%</span>
              </div>
              <div className="flex justify-between text-xs font-bold border-b pb-2">
                <span className="text-slate-500">Domingo</span>{" "}
                <span>12.5%</span>
              </div>
            </div>
          </div>

          {/* Gráfico de Barras: Top 10 Productos Vendidos */}
          <div className="col-span-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-8">
              Rendimiento de Inventario: Top 10 más vendidos
            </h4>
            <div className="space-y-4">
              {/* Fila de producto en gráfico de barras manual */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-black text-slate-700">
                  <span>Coca Cola 3L</span>
                  <span>13,451 unidades</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#275791] to-blue-400 h-full w-[95%] rounded-full"></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-black text-slate-700">
                  <span>Pan Batido (Kg)</span>
                  <span>11,820 unidades</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#275791] to-blue-400 h-full w-[80%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
