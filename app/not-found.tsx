import Link from "next/link";
import Icon from "@/app/components/Icon";

// Usa las variables CSS del tema: respeta claro y oscuro desde el primer fotograma
export default function NotFound() {
  return (
    <div
      className="flex items-center justify-center h-screen p-8"
      style={{ backgroundColor: "var(--bg-app)", color: "var(--text-main)" }}
    >
      <div
        className="max-w-md w-full rounded-3xl border p-10 text-center shadow-sm"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
      >
        <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl">
          <Icon name="search" />
        </div>
        <h1 className="text-xl font-black tracking-tight mb-2">Registro no encontrado</h1>
        <p className="text-sm font-medium mb-8" style={{ color: "var(--text-muted)" }}>
          La página o el registro que buscas no existe, o fue eliminado.
        </p>
        <Link
          href="/Main"
          className="inline-block px-6 py-3 rounded-2xl bg-[#1E3A5F] text-white text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
