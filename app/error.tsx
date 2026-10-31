"use client";

import ErrorPantalla from "@/app/components/ErrorPantalla";

// Atrapa errores de las rutas fuera del grupo (app): login y Main
export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col h-screen">
      <ErrorPantalla {...props} />
    </div>
  );
}
