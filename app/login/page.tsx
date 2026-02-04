"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Array de iconos de productos (SVGs de Retail)
  const productIcons = [
    <path key="1" d="M19 8h-1V7c0-3.31-2.69-6-6-6S6 3.69 6 7v1H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8 7c0-2.21 1.79-4 4-4s4 1.79 4 4v1H8V7z" />,
    <path key="2" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />,
    <path key="3" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H9v-2h6v2zm1.1-5H7.9l-1-2h10.2l-1 2z" />,
    <path key="4" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.42-.59l7-7c.37-.36.59-.86.59-1.42s-.22-1.06-.59-1.41zM5.5 8C4.67 8 4 7.33 4 6.5S4.67 5 5.5 5 7 5.67 7 6.5 6.33 8 5.5 8z" />,
    <path key="5" d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42s-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.4L15 9H9z" />
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/api/auth/login", { email, password, rememberMe });
      localStorage.setItem("token", response.data.token);
      const nombreUsuario = response.data.user?.nombre || "Usuario";
      localStorage.setItem("user_name", nombreUsuario);
      setSuccessMsg(`Sesión iniciada: Hola, ${nombreUsuario}`);
      setTimeout(() => router.push("/Main"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error de autenticación");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans selection:bg-blue-100 overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA: FORMULARIO SaaS CLEAN */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-12 bg-white shadow-[10px_0_50px_rgba(0,0,0,0.02)] z-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-sm">
          
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-[#1E3A5F] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <span className="text-white text-xl font-black italic">M</span>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">MiniPOS <span className="text-blue-500">MTZ</span></h1>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Ingresar</h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">Gestiona tu inventario y ventas en tiempo real con MiniPOS.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Correo Electrónico</label>
              <input
                type="email" value={email} placeholder="admin@minipos.cl" onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium" required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} placeholder="••••••••" onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer accent-blue-600" />
                <span className="text-xs text-slate-500 font-bold group-hover:text-slate-700 transition-colors">Recordarme</span>
              </label>
              <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">¿Olvidaste tu clave?</button>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600">
                  <span className="text-lg">⚠️</span>
                  <p className="text-xs font-bold">{error}</p>
                </motion.div>
              )}
              {successMsg && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-600">
                  <span className="text-lg">✅</span>
                  <p className="text-xs font-bold">{successMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading || !!successMsg} className="w-full bg-[#1E3A5F] hover:bg-blue-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98] disabled:opacity-50 text-sm uppercase tracking-widest">
              {loading ? "Sincronizando..." : "Acceder al Panel"}
            </button>
          </form>

          <div className="mt-20 pt-8 border-t border-slate-100">
             <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
               Power by MTZ System • 2026
             </p>
          </div>
        </motion.div>
      </div>

      {/* SECCIÓN DERECHA: ANIMACIÓN DE PRODUCTOS (RESTABLECIDA) */}
      <div className="hidden lg:flex w-[58%] bg-[#1E3A5F] relative items-center justify-center overflow-hidden">
        
        {/* Lluvia de Iconos en Columnas */}
        <div className="absolute inset-0 z-0 opacity-[0.12] flex justify-around px-4 pointer-events-none">
          {[...Array(6)].map((_, colIndex) => (
            <motion.div
              key={colIndex}
              animate={{ y: ["0%", "-50%"] }}
              transition={{ 
                duration: 20 + (colIndex * 4), 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="flex flex-col gap-24 py-8"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i} 
                  animate={{ rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  className="text-white"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    {productIcons[i % productIcons.length]}
                  </svg>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Contenido Central Branding */}
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            
            {/* Glow de fondo */}
            <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full scale-150" />
            
            <motion.div 
              animate={{ y: [0, -20, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-[420px] h-[420px] rounded-[80px] overflow-hidden border-[12px] border-white/5 shadow-2xl relative mx-auto"
            >
              <Image 
                src="/images/Cajera.png" 
                alt="POS Experience" 
                fill 
                className="object-cover scale-110" 
                priority 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/80 via-transparent to-transparent" />
            </motion.div>

            <div className="mt-16 space-y-4">
               <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white text-6xl font-black tracking-tighter italic"
               >
                 MiniPOS <span className="text-blue-400">MTZ</span>
               </motion.h3>
               <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-blue-100/60 text-xl font-medium max-w-sm mx-auto leading-relaxed"
               >
                 La evolución digital de tu <span className="text-white">punto de venta</span>.
               </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}