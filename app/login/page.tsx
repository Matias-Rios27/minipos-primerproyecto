"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de carga realista
    setTimeout(() => {
      router.push("/Main");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-blue-100">
      {/* LADO IZQUIERDO: FORMULARIO MINIMALISTA */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-white shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)] z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo y Branding */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[#275791] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
              MiniPOS <span className="text-[#275791]">MTZ</span>
            </h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Bienvenido
            </h2>
            <p className="text-slate-500">
              Ingresa tus credenciales para acceder al panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                Email Corporativo
              </label>
              <input
                type="email"
                placeholder="usuario@minipos.cl"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#275791] outline-none transition-all text-slate-700"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs font-bold text-[#275791] hover:underline"
                >
                  ¿La olvidaste?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-[#275791] outline-none transition-all text-slate-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="remember"
                className="w-5 h-5 rounded-md border-slate-300 text-[#275791] focus:ring-[#275791] cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-sm text-slate-600 font-medium cursor-pointer"
              >
                Mantener sesión activa por 30 días
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#275791] hover:bg-[#1a3d66] text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Entrar al Sistema"
              )}
            </button>
          </form>

          <p className="text-center mt-12 text-slate-400 text-xs">
            © 2026 MiniPOS MTZ v2.4.0 - Todos los derechos reservados.
          </p>
        </motion.div>
      </div>

      {/* LADO DERECHO: PANEL VISUAL "REALISTA" */}
      <div className="hidden lg:flex w-[55%] bg-[#275791] relative items-center justify-center overflow-hidden">
        {/* FONDO TECNOLÓGICO (Malla de gradientes y ruido) */}
        <div className="absolute inset-0 z-0">
          {/* Gradiente base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#275791] via-[#1e4470] to-[#162e4d]" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px]"
          />
          {/* PANEL DE PRODUCTOS VARIADOS - Movimiento Infinito Realista */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex justify-around px-4">
            {[...Array(5)].map((_, colIndex) => {
              // Definimos un set de diferentes iconos para cada columna
              const icons = [
                <path
                  key="1"
                  d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"
                />, // Bolsa
                <path
                  key="2"
                  d="M21 5V3H3v2l1 1v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6l1-1zM6 19V6h12v13H6z"
                />, // Bebida
                <path
                  key="3"
                  d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z"
                />, // Cubiertos
                <path
                  key="4"
                  d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 10H5V6h7v8z"
                />, // Pantalla/TV
                <path
                  key="5"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />, // Fruta/Círculo
              ];

              return (
                <motion.div
                  key={colIndex}
                  initial={{ y: 0 }}
                  animate={{ y: "-50%" }} 
                  transition={{
                    duration: 25 + colIndex * 3, 
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="flex flex-col gap-16 py-8"
                >
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="text-white"
                      style={{
                        filter: `blur(${colIndex % 2 !== 0 ? "1px" : "0px"})`,
                        opacity: colIndex % 2 !== 0 ? 0.5 : 1,
                      }}
                    >
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        {icons[i % icons.length]}
                      </svg>
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CONTENIDO CENTRAL */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative inline-block"
          >
            {/* Glow detrás de la cajera */}
            <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full scale-110" />
            {/* Imagen en Círculo Perfecto */}
            <div className="w-[400px] h-[400px] rounded-full overflow-hidden border-[12px] border-white/10 shadow-2xl relative">
              <Image
                src="/images/Cajera.png"
                alt="POS Specialist"
                fill
                className="object-cover scale-110" 
              />
            </div>
            {/* Badge flotante realista */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-6 top-10 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Estado Sistema
                </p>
                <p className="text-sm font-black text-slate-800 tracking-tight">
                  Ventas Online
                </p>
              </div>
            </motion.div>
          </motion.div>

          <div className="mt-10 space-y-2">
            <h3 className="text-white text-4xl font-black tracking-tight drop-shadow-sm">
              Potencia tu punto de venta
            </h3>
            <p className="text-blue-100/70 text-lg max-w-sm mx-auto font-medium leading-relaxed">
              La plataforma inteligente para el crecimiento de tu negocio local.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
