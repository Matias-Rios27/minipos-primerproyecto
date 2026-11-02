import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { NextResponse, type NextRequest } from "next/server";
import { mensajeVariablesFaltantes, variablesFaltantes, variablesSupabase } from "./env";

const RUTAS_PUBLICAS = ["/", "/login"];

// Renueva la sesion en cada navegacion y protege las rutas privadas
export async function updateSession(request: NextRequest) {
  // Sin variables toda ruta fallaria con un "Internal Server Error" que oculta la causa:
  // se responde con texto claro (solo nombres de variables, nunca valores).
  const faltan = variablesFaltantes();
  if (faltan.length > 0) {
    return new NextResponse(mensajeVariablesFaltantes(faltan), {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  let response = NextResponse.next({ request });

  const { url, key } = variablesSupabase();
  const supabase = createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getClaims verifica la firma del JWT de forma local (el proyecto usa claves asimetricas ES256),
  // sin la llamada de red de getUser. Renueva el token si esta por vencer. No usar getSession aqui.
  // Compromiso: un usuario desactivado conserva el acceso hasta que expire su token; RLS sigue
  // bloqueando sus datos porque private.es_activo() consulta perfiles en cada peticion.
  const { data } = await supabase.auth.getClaims();
  const autenticado = Boolean(data?.claims);

  const esPublica = RUTAS_PUBLICAS.includes(request.nextUrl.pathname);

  if (!autenticado && !esPublica) {
    return redirigir(request, response, "/login");
  }
  if (autenticado && esPublica) {
    return redirigir(request, response, "/Main");
  }

  return response;
}

// La redireccion conserva las cookies de sesion renovadas
function redirigir(request: NextRequest, response: NextResponse, destino: string) {
  const url = request.nextUrl.clone();
  url.pathname = destino;
  const redireccion = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redireccion.cookies.set(cookie));
  return redireccion;
}
