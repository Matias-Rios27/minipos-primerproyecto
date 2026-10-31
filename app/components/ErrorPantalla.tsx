"use client";

import { useEffect } from "react";
import Icon from "@/app/components/Icon";

interface ErrorPantallaProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Pantalla de error compartida. Usa las variables CSS del tema, por eso respeta claro y oscuro.
export default function ErrorPantalla({ error, reset }: ErrorPantallaProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex-1 min-h-0 flex items-center justify-center p-8"
      style={{ backgroundColor: "var(--bg-app)", color: "var(--text-main)" }}
    >
      <div
        className="max-w-md w-full rounded-3xl border p-10 text-center shadow-sm"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl">
          <Icon name="alert" />
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2">No se pudo cargar la información</h2>
        <p className="text-sm font-medium mb-8" style={{ color: "var(--text-muted)" }}>
          Hubo un problema al consultar los datos. Revisa tu conexión e inténtalo de nuevo.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-2xl bg-[#1E3A5F] text-white text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
        >
          Reintentar
        </button>
        {error.digest && (
          <p className="mt-6 text-[10px] font-mono opacity-40">Código: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
