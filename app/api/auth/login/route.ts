import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Credenciales de invitado para portafolio
    if (email === "portafolio@minipos.cl" && password === "portafolio2026") {
      return NextResponse.json({
        token: "fake-jwt-token-portfolio",
        user: {
          id: 999,
          usuario_id: 999,
          nombre: "Invitado Portafolio",
          email: "portafolio@minipos.cl",
          rol: "admin"
        }
      });
    }

    // Aquí podrías agregar más lógica de validación si fuera necesario
    // Por ahora, solo aceptamos al invitado para evitar el 404
    return NextResponse.json(
      { message: "Credenciales inválidas" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}
