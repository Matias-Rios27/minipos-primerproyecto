"use client";

import { useIsDark } from "@/app/components/ThemeProvider";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateProducto, deleteProduct } from "@/lib/api";
import type { Categoria, Producto } from "@/types/types";
import Icon from "@/app/components/Icon";

interface Proveedor {
  proveedor_id: number;
  nombre: string;
}

interface EditarProductoClientProps {
  productoInicial: Producto & { fecha_caducidad: string | null };
  proveedores: Proveedor[];
  categorias: Categoria[];
}

export default function EditarProductoClient({ productoInicial, proveedores, categorias }: EditarProductoClientProps) {
  const router = useRouter();
  const { id } = useParams(); 
  
  const [isDark, setIsDark] = useIsDark();
  const [isMounted, setIsMounted] = useState(false);

  // --- LÓGICA DE ESTADO ---
  const [activo, setActivo] = useState<boolean>(productoInicial.activo);

  // --- LÓGICA DE IMAGEN ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(productoInicial.imagen_url ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LÓGICA DE PROVEEDORES Y CATEGORIAS ---
  const proveedoresDB = proveedores;
  const categoriasDB = categorias;

  const [formData, setFormData] = useState({
    nombre: productoInicial.nombre || "",
    precio: String(productoInicial.precio ?? ""),
    stock: String(productoInicial.stock ?? ""),
    stock_minimo: String(productoInicial.stock_minimo ?? ""),
    fecha_caducidad: productoInicial.fecha_caducidad ? productoInicial.fecha_caducidad.split("T")[0] : "",
    categoria_id: productoInicial.categoria_id?.toString() || "",
    proveedor_id: productoInicial.proveedor_id?.toString() || "",
  });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const timer = setTimeout(() => setIsMounted(true), 100);

    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") && !/\.(jpg|jpeg|png|gif|webp|svg|bmp|jfif|avif)$/i.test(file.name)) {
        alert("Por favor selecciona un formato de imagen válido (JPG, PNG, WEBP...).");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    data.append("nombre", formData.nombre);
    data.append("precio", formData.precio);
    data.append("stock", formData.stock);
    data.append("stock_minimo", formData.stock_minimo);
    data.append("categoria_id", formData.categoria_id);
    data.append("proveedor_id", formData.proveedor_id);
    
    // IMPORTANTE: Enviamos el estado activo correctamente
    data.append("activo", activo ? "1" : "0");

    if (formData.fecha_caducidad) {
      data.append("fecha_caducidad", formData.fecha_caducidad);
    } else {
      data.append("fecha_caducidad", ""); // Para permitir limpiar la fecha
    }

    if (imageFile) {
      data.append("imagen", imageFile); 
    } else if (preview) {
      data.append("imagen_url", preview);
    }

    try {
      await updateProducto(Number(id), data);
      alert("¡Producto actualizado con éxito!");
      router.push("/inventario");
    } catch (error: any) {
      alert(`Error al actualizar producto`);
    }
  };

  const handleOnDelete = async () => {
    if (window.confirm("¿Eliminar este producto permanentemente?")) {
      try {
        await deleteProduct(Number(id));
        router.push("/inventario");
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const theme = {
    bg: isDark ? "#0B1120" : "#F8FAFC",
    header: isDark ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
    card: isDark ? "#111827" : "#FFFFFF",
    text: isDark ? "#F1F5F9" : "#1E293B",
    textMuted: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#1E293B" : "#E2E8F0",
    subtle: isDark ? "#1F2937" : "#F1F5F9",
  };

  const labelClass = "text-[10px] font-black uppercase ml-2 mb-2 block tracking-widest";

  if (!isMounted) return null;

  


  return (
    <div className="flex flex-col flex-1 min-h-0 font-sans overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.bg, color: theme.text }}>
      

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">
            ← Volver al Inventario
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* COLUMNA IMAGEN */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <label className={labelClass} style={{ color: theme.textMuted }}>Imagen del producto</label>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="*/*" className="hidden" />

              <div 
                onClick={triggerFileInput}
                className="aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all hover:border-blue-500/50 group cursor-pointer overflow-hidden"
                style={{ borderColor: theme.border, backgroundColor: theme.subtle }}
              >
                {preview ? (
                  <img src={preview} alt="Vista previa" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl mb-4 block"><Icon name="camera" /></span>
                    <p className="text-[10px] font-black uppercase opacity-40">Click para subir</p>
                  </div>
                )}
              </div>
              
              <button 
                type="button" 
                onClick={triggerFileInput}
                className="w-full py-3 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg active:scale-95 transition-all"
              >
                {preview ? "Cambiar Imagen" : "Subir Imagen"}
              </button>
            </div>

            {/* COLUMNA FORMULARIO */}
            <div className="flex-1">
              <div className="rounded-3xl border shadow-xl overflow-hidden" style={{ backgroundColor: theme.card, borderColor: theme.border }}>
                <div className="p-8 border-b" style={{ borderColor: theme.border, backgroundColor: theme.subtle }}>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Ficha de Producto</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className={labelClass} style={{ color: theme.textMuted }}>Nombre</label>
                    <input type="text" required value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full border rounded-2xl py-4 px-6 font-bold outline-none"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                  </div>

                  <div>
                    <label className={labelClass} style={{ color: theme.textMuted }}>Precio ($)</label>
                    <input type="number" step="0.01" required value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})}
                      className="w-full border rounded-2xl py-4 px-6 font-black text-blue-600 outline-none"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border }} />
                  </div>

                  <div>
                    <label className={labelClass} style={{ color: theme.textMuted }}>Categoría</label>
                    <select 
                      value={formData.categoria_id} 
                      onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                      className="w-full border rounded-2xl py-4 px-6 font-bold outline-none cursor-pointer"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }}
                    >
                      <option value="" disabled>Seleccionar Categoría</option>
                      {categoriasDB.map((cat) => (
                        <option key={cat.categoria_id} value={cat.categoria_id.toString()}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass} style={{ color: theme.textMuted }}>Stock Actual</label>
                    <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full border rounded-2xl py-4 px-6 font-bold outline-none"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                  </div>

                  <div>
                    <label className={labelClass} style={{ color: theme.textMuted }}>Stock Mínimo</label>
                    <input type="number" required value={formData.stock_minimo} onChange={(e) => setFormData({...formData, stock_minimo: e.target.value})}
                      className="w-full border rounded-2xl py-4 px-6 font-bold outline-none"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                  </div>

                  <div>
                    <label className={labelClass} style={{ color: theme.textMuted }}>Fecha de Caducidad</label>
                    <input type="date" value={formData.fecha_caducidad} onChange={(e) => setFormData({...formData, fecha_caducidad: e.target.value})}
                      className="w-full border rounded-2xl py-4 px-6 font-bold outline-none"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }} />
                  </div>

                  <div>
                    <label className={labelClass} style={{ color: theme.textMuted }}>Proveedor Principal</label>
                    <select 
                      value={formData.proveedor_id} 
                      onChange={(e) => setFormData({...formData, proveedor_id: e.target.value})}
                      className="w-full border rounded-2xl py-4 px-6 font-bold outline-none cursor-pointer appearance-none"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: theme.text }}
                    >
                      <option value="" disabled>Seleccionar Proveedor</option>
                      {proveedoresDB.map((p) => (
                        <option key={p.proveedor_id} value={p.proveedor_id.toString()}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ESTADO DE VENTA */}
                  <div className="md:col-span-2 space-y-2">
                    <label className={labelClass} style={{ color: theme.textMuted }}>Estado de Venta</label>
                    <div className="flex gap-4">
                      <button 
                        type="button" 
                        onClick={() => setActivo(true)} 
                        className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${activo ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}
                      >
                        ACTIVO
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setActivo(false)} 
                        className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${!activo ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}
                      >
                        OCULTO
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 mt-4 flex gap-4">
                    <button type="submit" className="flex-1 bg-[#1E3A5F] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                      Guardar Cambios
                    </button>
                    <button type="button" onClick={handleOnDelete} className="px-10 py-5 rounded-2xl font-black text-xs uppercase border transition-all active:scale-95"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: "#EF4444" }}>
                      Eliminar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}