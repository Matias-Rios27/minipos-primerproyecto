import Navbar from "@/app/components/Navbar";

// Layout compartido de las pantallas autenticadas: el Navbar persiste entre navegaciones
// y solo cambia el contenido de debajo. Main queda fuera porque tiene su propia barra lateral.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-app)", color: "var(--text-main)" }}
    >
      <Navbar />
      {children}
    </div>
  );
}
