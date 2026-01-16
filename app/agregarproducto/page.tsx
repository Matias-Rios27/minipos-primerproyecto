"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgregarProductoPage() {
  const router = useRouter();

  // Estado inicial para capturar los datos del formulario (según tu diagrama ER)
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria: "General",
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR */}
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
      <main className="max-w-4xl mx-auto p-8">
        {/* Botón Volver rápido */}
        <button
          onClick={() => router.back()}
          className="text-[#275791] font-bold flex items-center gap-2 mb-6 hover:underline text-sm"
        >
          ← Volver atrás
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Encabezado del Formulario (Estilo formal azul) */}
          <div className="bg-[#275791] p-6 text-white">
            <h2 className="text-xl font-black uppercase tracking-widest">
              Registrar Nuevo Producto
            </h2>
            <p className="text-blue-200 text-xs mt-1 font-medium">
              Complete todos los campos para actualizar el stock
            </p>
          </div>

          <form className="p-8 grid grid-cols-2 gap-6">
            {/* Campo: Nombre del Producto */}
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Nombre del Producto
              </label>
              <input
                type="text"
                placeholder="Ej: Coca Cola 3L"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#275791] focus:ring-4 focus:ring-blue-50 transition-all font-bold"
              />
            </div>

            {/* Campo: Precio (Decimal en DB) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Precio de Venta ($)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#275791] focus:ring-4 focus:ring-blue-50 transition-all font-bold text-[#00df82]"
              />
            </div>

            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Proveedor
              </label>
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#275791] font-bold appearance-none cursor-pointer">
                <option>Distribuidora Global</option>
                <option>Bebidas S.A.</option>
              </select>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#275791] font-bold text-slate-600"
              />
            </div>

            {/* Sección de Imagen del Producto */}
            <div className="col-span-2 space-y-2 pt-4">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Imagen del Producto
              </label>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Visualizador de Previa */}
                <div className="w-40 h-40 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                  {/* Si no hay imagen, mostramos un icono; si hay, la imagen */}
                  <span className="text-4xl opacity-20 group-hover:scale-110 transition-transform">
                    📸
                  </span>
                  {/* <Image src={previewUrl} fill className="object-contain" /> */}
                </div>

                {/* Zona de Carga */}
                <div className="flex-1 w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-[#275791] transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-slate-400 group-hover:text-[#275791] transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-slate-500">
                        <span className="font-bold">Haga clic para cargar</span>{" "}
                        o arrastre y suelte
                      </p>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">
                        PNG, JPG o WEBP (Recomendado 500x500px)
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>

            {/* Campo: Stock Inicial (Int en DB) */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Stock Inicial
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#275791] focus:ring-4 focus:ring-blue-50 transition-all font-bold"
              />
            </div>
          </form>
        </div>
        {/* Botones de Acción */}
        <div className="col-span-2 pt-6 border-t border-slate-100 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-[#275791] text-white font-black py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:bg-[#1a3d66] active:scale-95 transition-all uppercase tracking-widest text-sm"
          >
            💾 Guardar Producto
          </button>
          <button
            type="reset"
            className="px-8 bg-slate-100 text-slate-500 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
          >
            Limpiar
          </button>
        </div>
      </main>
    </div>
  );
}
