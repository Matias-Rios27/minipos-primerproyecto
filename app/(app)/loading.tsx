// Skeleton del contenido: el Navbar real queda visible porque vive en el layout del grupo.
const bloque = "animate-pulse rounded-2xl";

export default function Loading() {
  return (
    <div className="flex-1 min-h-0 overflow-hidden p-8" style={{ backgroundColor: "var(--bg-app)" }}>
      <div className="space-y-6 max-w-7xl w-full mx-auto">
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
