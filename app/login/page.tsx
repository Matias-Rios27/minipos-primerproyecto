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
    // Bolsa de compras
    <path d="M19 8h-1V7c0-3.31-2.69-6-6-6S6 3.69 6 7v1H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8 7c0-2.21 1.79-4 4-4s4 1.79 4 4v1H8V7z" />,
    // Carrito
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />,
    // Caja / Paquete
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H9v-2h6v2zm1.1-5H7.9l-1-2h10.2l-1 2z" />,
    // Etiqueta de precio
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.42-.59l7-7c.37-.36.59-.86.59-1.42s-.22-1.06-.59-1.41zM5.5 8C4.67 8 4 7.33 4 6.5S4.67 5 5.5 5 7 5.67 7 6.5 6.33 8 5.5 8z" />,
    // Cesta
    <path d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42s-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.92 1.46h13c.92 0 1.69-.62 1.93-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.4L15 9H9z" />
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const response = await api.post("/api/auth/login", { email, password, rememberMe });
      localStorage.setItem("token", response.data.token);
      const nombreUsuario = response.data.user?.nombre || "Usuario";
      setSuccessMsg(`¡Bienvenido de nuevo, ${nombreUsuario}!`);
      setTimeout(() => router.push("/Main"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciales incorrectas");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-blue-100 overflow-hidden">
      
      {/* LADO IZQUIERDO: FORMULARIO */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-white shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)] z-20">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-10 h-10 bg-[#275791] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 cursor-default">
              <span className="text-white text-xl font-bold">M</span>
            </motion.div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">MiniPOS <span className="text-[#275791]">MTZ</span></h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Bienvenido</h2>
            <p className="text-slate-500 font-medium">Ingresa al panel de control de tu negocio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Email Corporativo</label>
              <input
                type="email" value={email} placeholder="usuario@minipos.cl" onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#275791] outline-none transition-all text-slate-700" required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} placeholder="••••••••••••" onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#275791] outline-none transition-all text-slate-700" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#275791] transition-colors text-xl">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-5 h-5 rounded-md border-slate-300 text-[#275791] focus:ring-[#275791] cursor-pointer accent-[#275791]" />
              <label htmlFor="remember" className="text-sm text-slate-600 font-medium cursor-pointer select-none">Mantener sesión activa por 30 días</label>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-600 shadow-sm">
                  <div className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">!</div>
                  <p className="text-sm font-semibold">{error}</p>
                </motion.div>
              )}
              {successMsg && (
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 text-emerald-700 shadow-md">
                  <div className="bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs">✓</div>
                  <p className="text-sm font-bold">{successMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading || !!successMsg} className="w-full bg-[#275791] hover:bg-[#1a3d66] text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-lg">
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : successMsg ? "Sincronizando..." : "Entrar al Sistema"}
            </button>
          </form>
          <p className="text-center mt-12 text-slate-400 text-xs italic tracking-wide">© 2026 MiniPOS MTZ v2.4.0</p>
        </motion.div>
      </div>

      {/* LADO DERECHO: ANIMACIÓN ACTUALIZADA CON PRODUCTOS */}
      <div className="hidden lg:flex w-[55%] bg-[#275791] relative items-center justify-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#275791] via-[#1e4470] to-[#162e4d]" />
          
          <div className="absolute inset-0 opacity-[0.15] flex justify-around px-4">
            {[...Array(6)].map((_, colIndex) => (
              <motion.div
                key={colIndex}
                animate={{ y: ["0%", "-50%"] }}
                transition={{ 
                  duration: 25 + (colIndex * 3), 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="flex flex-col gap-24 py-8"
              >
                {[...Array(15)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    className="text-white"
                  >
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                      {productIcons[i % productIcons.length]}
                    </svg>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contenido Central */}
        <div className="relative z-10 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative inline-block">
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-blue-400/30 blur-[120px] rounded-full" />
            
            <motion.div animate={{ y: [0, -20, 0], rotate: [-1, 1, -1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="w-[400px] h-[400px] rounded-full overflow-hidden border-[12px] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative group">
              <Image src="/images/Cajera.png" alt="POS Specialist" fill className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700" priority />
            </motion.div>

            {/* Card Flotante */}
            <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -right-12 top-20 bg-white/95 backdrop-blur-sm p-5 rounded-3xl shadow-2xl border border-white/20 flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200"><span className="text-white text-xl">⚡</span></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Servidor</p>
                <p className="text-sm font-black text-slate-800 tracking-tight">MTZ Cloud Ok</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-14 space-y-4">
            <h3 className="text-white text-6xl font-black tracking-tighter drop-shadow-2xl">MiniPOS <span className="text-blue-300">MTZ</span></h3>
            <p className="text-blue-100/70 text-xl font-light tracking-wide max-w-md mx-auto">La evolución digital de tu <span className="text-white font-semibold">punto de venta</span>.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}