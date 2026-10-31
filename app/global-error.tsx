"use client";

// Último recurso: se muestra si falla el layout raíz. Debe traer su propio html y body.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#F8FAFC",
          color: "#1E293B",
        }}
      >
        <div style={{ textAlign: "center", padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 8px" }}>Algo salió mal</h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px" }}>
            La aplicación tuvo un error inesperado.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 24px",
              borderRadius: 16,
              border: 0,
              background: "#1E3A5F",
              color: "#fff",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
