"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type TemaContext = [boolean, Dispatch<SetStateAction<boolean>>];

const ThemeContext = createContext<TemaContext | null>(null);

// La cookie permite que el servidor renderice con el tema correcto desde el primer fotograma
const guardarTema = (oscuro: boolean) => {
  const valor = oscuro ? "dark" : "light";
  document.cookie = `theme=${valor}; path=/; max-age=31536000; samesite=lax`;
  try {
    localStorage.setItem("theme", valor);
  } catch {
    // modo privado: la cookie basta
  }
};

export function ThemeProvider({
  inicialOscuro,
  children,
}: {
  inicialOscuro: boolean;
  children: ReactNode;
}) {
  const [isDark, setIsDark] = useState(inicialOscuro);

  // La clase de <html> es la fuente de verdad: las paginas y el Navbar la cambian directamente
  useEffect(() => {
    const sincronizar = () => {
      const oscuro = document.documentElement.classList.contains("dark");
      setIsDark(oscuro);
      guardarTema(oscuro);
    };

    sincronizar();
    const observer = new MutationObserver(sincronizar);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return <ThemeContext.Provider value={[isDark, setIsDark]}>{children}</ThemeContext.Provider>;
}

// Mismo contrato que useState: [isDark, setIsDark]
export function useIsDark() {
  const contexto = useContext(ThemeContext);
  if (!contexto) throw new Error("useIsDark debe usarse dentro de ThemeProvider");
  return contexto;
}
