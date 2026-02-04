"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProducto, getNotificaciones, deleteProduct, getProveedores } from "@/lib/api";

interface Alerta {
  notificacion_id: number;
  tipo: 'stock' | 'vencimiento';
  mensaje: string;
}

interface Proveedor {
  proveedor_id: number;
  nombre: string;
}

export default function EditarProductoPage() {
  const router = useRouter();
  const { id } = useParams(); 
  
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  // --- LÓGICA DE ESTADO ---
  const [activo, setActivo] = useState<boolean>(true);

  // --- LÓGICA DE IMAGEN ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LÓGICA DE PROVEEDORES ---
  const [proveedoresDB, setProveedoresDB] = useState<Proveedor[]>([]);

  const categoriesList = [
    { id: "1", name: "Bebidas", icon: "🥤" },
    { id: "2", name: "Alimentos", icon: "🍱" },
    { id: "3", name: "Limpieza", icon: "🧼" },
    { id: "4", name: "Cuidado Personal", icon: "✨" },
    { id: "5", name: "Electronicos", icon: "💻" },
    { id: "6", name: "Mascotas", icon: "🐾" },
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    stock_minimo: "",
    fecha_caducidad: "",
    categoria_id: "",
    proveedor_id: "" 
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const resProveedores = await getProveedores();
        setProveedoresDB(resProveedores || []);

        const p = await getProductById(Number(id));
        setFormData({
          nombre: p.nombre || "",
          precio: p.precio || "",
          stock: p.stock || "",
          stock_minimo: p.stock_minimo || "",
          fecha_caducidad: p.fecha_caducidad ? p.fecha_caducidad.split('T')[0] : "",
          categoria_id: p.categoria_id?.toString() || "",
          proveedor_id: p.proveedor_id?.toString() || ""
        });
        
        // Sincronizamos el estado de la base de datos
        setActivo(p.activo === true || p.activo === 1);
        
        if (p.imagen_url) {
            setPreview(p.imagen_url);
        }

        const dataAlerts = await getNotificaciones();
        setAlertas(dataAlerts || []);
      } catch (error) {
        console.error("Error al cargar datos de la BD:", error);
      }
    };

    if (id) loadInitialData();
    
    setUserName(localStorage.getItem("user_name") || "Admin");
    setIsDark(document.documentElement.classList.contains("dark"));
    const timer = setTimeout(() => setIsMounted(true), 100);

    return () => clearTimeout(timer);
  }, [id]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      alert("✅ ¡Producto actualizado con éxito!");
      router.push("/inventario");
    } catch (error: any) {
      alert(`❌ Error al actualizar producto`);
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

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
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
    <div className="flex flex-col h-screen font-sans overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: theme.bg, color: theme.text }}>
      
      <header className="h-20 backdrop-blur-md border-b px-8 flex justify-between items-center z-30 shrink-0"
        style={{ backgroundColor: theme.header, borderColor: theme.border }}>
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#1E3A5F] text-white p-1.5 rounded-lg font-black text-xs">MP</div>
            <h1 className="text-lg font-bold">Gestión de Inventario</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium" style={{ color: theme.textMuted }}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Editando Registro • ID: #{id}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex p-1 rounded-xl mr-4 border" style={{ backgroundColor: theme.subtle, borderColor: theme.border }}>
            <button onClick={() => router.push("/Main")} className="px-4 py-2 text-xs font-bold opacity-70">Punto de Venta</button>
            <button onClick={() => router.push("/inventario")} className="px-4 py-2 text-xs font-bold opacity-70">Inventario</button>
            <button className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg shadow-sm" style={isDark ? { backgroundColor: "#334155", color: "#60A5FA" } : {}}>Editar</button>
          </div>

          <button onClick={toggleDarkMode} className="p-2.5 rounded-xl border transition-all text-lg"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            {userName.substring(0, 2).toUpperCase()}
          </div>          
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 font-bold text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">
            ← Volver al Inventario
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* COLUMNA IMAGEN */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <label className={labelClass} style={{ color: theme.textMuted }}>Imagen Cloudinary</label>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

              <div 
                onClick={triggerFileInput}
                className="aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all hover:border-blue-500/50 group cursor-pointer overflow-hidden"
                style={{ borderColor: theme.border, backgroundColor: theme.subtle }}
              >
                {preview ? (
                  <img src={preview} alt="Vista previa" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center">
                    <span className="text-4xl mb-4 block">📸</span>
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
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
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
                          📦 {p.nombre}
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
                      ✅ Guardar Cambios
                    </button>
                    <button type="button" onClick={handleOnDelete} className="px-10 py-5 rounded-2xl font-black text-xs uppercase border transition-all active:scale-95"
                      style={{ backgroundColor: theme.subtle, borderColor: theme.border, color: "#EF4444" }}>
                      🗑️ Eliminar
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