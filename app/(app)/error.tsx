"use client";

import ErrorPantalla from "@/app/components/ErrorPantalla";

// Atrapa errores de las pantallas autenticadas: el Navbar del layout sigue visible
export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPantalla {...props} />;
}
