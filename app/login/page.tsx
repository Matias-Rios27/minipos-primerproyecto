"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }
    setLoading(true);
    router.push("/Main");
    setTimeout(() => setLoading(false), 1500);

  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden">
      {/* Lado Izquierdo - Formulario con entrada suave */}
      <motion.div 
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 z-10"
      >
        <form onSubmit={handleSubmit} className="w-full max-w-[400px] space-y-6">
          
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl">🏪</span>
            <h1 className="text-xl font-bold text-gray-800">Nombre Emprendimiento</h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h2 className="text-4xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-500">Bienvenido de vuelta, ingresa tus datos.</p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 text-black rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#275791] outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-black border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#275791] outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-700 gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#275791]"
              />
              Mantener sesión iniciada
            </label>
            <a href="#" className="text-sm font-medium text-[#275791] hover:underline transition-all">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* ANIMACIONES */}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#275791] hover:bg-[#1e4470] text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-70"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </motion.button>
        </form>
      </motion.div>

      {/* Lado Derecho - Panel con Fondo Animado e Imagen con Pop */}
      <div className="hidden lg:flex w-1/2 bg-[#275791] items-center justify-center relative overflow-hidden">
        
        {/* CUADROS DE FONDO - Animación de movimiento infinito */}
        <motion.div 
          animate={{ 
            x: [ 0, 60],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-0 opacity-20"
          style={{ width: '120%', height: '120%' }}
        >
          <svg width="100%" height="100%">
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>
        
        <div className="text-center z-10">
          {/* IMAGEN PRINCIPAL */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 12,
              delay: 0.5 
            }}
            className="bg-white/10 p-11 rounded-full backdrop-blur-md mb-5 inline-block border border-white/20"
          >
             <Image 
                alt="Imagen Principal" 
                src="/images/Icono-login.png" 
                width={180} 
                height={180}
                priority
                className="drop-shadow-2xl"
             />
          </motion.div> 
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-white text-3xl font-bold">MiniPOS</h2>
            <h2 className="text-white text-3xl font-bold">Gestiona tu negocio</h2>
            <p className="text-blue-100 mt-2 max-w-xs mx-auto text-lg">
              La herramienta más potente para controlar tus ventas y finanzas.
            </p>
          </motion.div>
        </div>

        {/* Círculos decorativos */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}