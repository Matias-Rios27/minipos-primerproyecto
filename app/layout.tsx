import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "./components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiniPOS Matias Rios",
  description: "Sistema de punto de venta para supermercados y negocios de barrio",
};

// Primera visita sin cookie: se decide por localStorage o por la preferencia del sistema
const scriptTema = `
  (function() {
    var guardado = localStorage.getItem('theme');
    var oscuro = guardado === 'dark' || (!guardado && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', oscuro);
  })()
`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // El servidor renderiza con el tema correcto: evita el destello claro al navegar o recargar
  const oscuro = (await cookies()).get("theme")?.value === "dark";

  return (
    <html lang="es" className={oscuro ? "dark" : undefined} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        <ThemeProvider inicialOscuro={oscuro}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
