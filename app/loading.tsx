// Skeleton instantaneo mientras el servidor responde la navegacion.
// Usa las variables CSS del tema, por eso sale con el color correcto en claro y oscuro.
const bloque = "animate-pulse rounded-2xl";

export default function Loading() {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: "var(--bg-app)" }}>
      <div
        className="h-20 shrink-0 border-b flex items-center justify-between px-6"
        style={{ backgroundColor: "var(--bg-header)", borderColor: "var(--border-color)" }}
      >
        <div className={`${bloque} h-10 w-44`} style={{ backgroundColor: "var(--subtle-color)" }} />
        <div className={`${bloque} h-10 w-[28rem] hidden lg:block`} style={{ backgroundColor: "var(--subtle-color)" }} />
        <div className={`${bloque} h-10 w-28`} style={{ backgroundColor: "var(--subtle-color)" }} />
      </div>

      <div className="flex-1 p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className={`${bloque} h-9 w-72`} style={{ backgroundColor: "var(--subtle-color)" }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`${bloque} h-48 border`}
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
