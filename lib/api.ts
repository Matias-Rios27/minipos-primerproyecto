import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";
import type { BalanceHistorico, DashboardStats } from "@/types/types";

const supabase = createClient();

// Las lecturas aceptan el cliente del servidor para poder usarse desde Server Components
// (prefetch de datos en el HTML). Las funciones con cache compartido son solo del navegador.
type Cliente = SupabaseClient<Database>;

const BUCKET_IMAGENES = "productos";

// ── Utilidades ────────────────────────────────────────────────────────────

// Error de la capa de datos con el codigo de Postgres/PostgREST
export class ErrorApi extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

// PGRST116: se pidio una fila (.single()) y no existe
export const esNoEncontrado = (error: unknown) => error instanceof ErrorApi && error.code === "PGRST116";

// Devuelve los datos o lanza el error para que la pagina lo capture con try/catch
const datos = <T>({ data, error }: { data: T; error: PostgrestError | null }) => {
  if (error) throw new ErrorApi(error.message, error.code);
  return data as Exclude<T, null>;
};

// RLS no devuelve error cuando bloquea una escritura: simplemente afecta 0 filas
const conFilas = <T>(respuesta: { data: T[] | null; error: PostgrestError | null }) => {
  const filas = datos(respuesta);
  if (!filas || filas.length === 0) {
    throw new Error("Registro no encontrado o sin permiso para modificarlo");
  }
  return filas;
};

// Peticiones identicas hechas casi a la vez (por ejemplo el Navbar y la pagina) comparten una sola llamada
const compartidas = new Map<string, { expira: number; promesa: Promise<unknown> }>();
const compartir = <T>(clave: string, ttlMs: number, cargar: () => Promise<T>): Promise<T> => {
  const vigente = compartidas.get(clave);
  if (vigente && vigente.expira > Date.now()) return vigente.promesa as Promise<T>;

  const promesa = cargar().catch((error) => {
    compartidas.delete(clave);
    throw error;
  });
  compartidas.set(clave, { expira: Date.now() + ttlMs, promesa });
  return promesa;
};

const texto = (formData: FormData, campo: string) => formData.get(campo)?.toString() ?? "";
const entero = (formData: FormData, campo: string) => parseInt(texto(formData, campo)) || 0;
const enteroOpcional = (formData: FormData, campo: string) => {
  const valor = parseInt(texto(formData, campo));
  return Number.isNaN(valor) ? null : valor;
};

const subirImagen = async (archivo: File) => {
  const extension = archivo.name.split(".").pop()?.toLowerCase() || "jpg";
  const ruta = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(BUCKET_IMAGENES)
    .upload(ruta, archivo, { contentType: archivo.type });
  if (error) throw new Error(error.message);
  return supabase.storage.from(BUCKET_IMAGENES).getPublicUrl(ruta).data.publicUrl;
};

// ── Productos ─────────────────────────────────────────────────────────────
export const getProducts = async (cliente: Cliente = supabase) =>
  datos(await cliente.from("productos").select("*").order("producto_id"));

export const getProductById = async (id: number, cliente: Cliente = supabase) =>
  datos(await cliente.from("productos").select("*").eq("producto_id", id).single());

export const createProducto = async (formData: FormData) => {
  const archivo = formData.get("imagen");
  const imagen_url = archivo instanceof File && archivo.size > 0 ? await subirImagen(archivo) : null;

  const producto = datos(
    await supabase
      .from("productos")
      .insert({
        nombre: texto(formData, "nombre"),
        precio: parseFloat(texto(formData, "precio")) || 0,
        stock: entero(formData, "stock"),
        stock_minimo: entero(formData, "stock_minimo"),
        categoria_id: enteroOpcional(formData, "categoria_id"),
        proveedor_id: enteroOpcional(formData, "proveedor_id"),
        fecha_caducidad: texto(formData, "fecha_caducidad") || null,
        imagen_url,
      })
      .select()
      .single()
  );

  return { message: "Producto registrado con éxito", producto };
};

export const updateProducto = async (id: number, formData: FormData) => {
  const cambios: Database["public"]["Tables"]["productos"]["Update"] = {
    nombre: texto(formData, "nombre"),
    precio: parseFloat(texto(formData, "precio")) || 0,
    stock: entero(formData, "stock"),
    stock_minimo: entero(formData, "stock_minimo"),
    fecha_caducidad: texto(formData, "fecha_caducidad") || null,
    activo: ["true", "1"].includes(texto(formData, "activo")),
  };

  // Si llegan vacios se conservan los valores anteriores
  const categoria_id = enteroOpcional(formData, "categoria_id");
  const proveedor_id = enteroOpcional(formData, "proveedor_id");
  if (categoria_id !== null) cambios.categoria_id = categoria_id;
  if (proveedor_id !== null) cambios.proveedor_id = proveedor_id;

  const archivo = formData.get("imagen");
  if (archivo instanceof File && archivo.size > 0) {
    cambios.imagen_url = await subirImagen(archivo);
  } else {
    const actual = texto(formData, "imagen_url");
    if (actual.startsWith("http")) cambios.imagen_url = actual;
  }

  conFilas(await supabase.from("productos").update(cambios).eq("producto_id", id).select());
  return { message: "Producto actualizado correctamente" };
};

export const deleteProduct = async (id: number) => {
  const { data, error } = await supabase.from("productos").delete().eq("producto_id", id).select();
  if (error) {
    // 23503: el producto aparece en ventas
    throw new Error(
      error.code === "23503"
        ? "No se puede eliminar porque este producto tiene historial de ventas."
        : error.message
    );
  }
  if (!data || data.length === 0) throw new Error("Producto no encontrado o sin permiso");
  return { message: "Producto eliminado definitivamente de la base de datos" };
};

// ── Notificaciones ────────────────────────────────────────────────────────
export const getNotificaciones = () =>
  compartir("notificaciones", 3000, async () => {
    const filas = datos(
      await supabase
        .from("notificaciones")
        .select("*, productos(nombre)")
        .order("notificacion_id", { ascending: false })
    );
    return filas.map(({ productos, ...n }) => ({ ...n, producto_nombre: productos?.nombre ?? null }));
  });

export const deleteNotificacion = async (id: number) => {
  datos(await supabase.from("notificaciones").delete().eq("notificacion_id", id));
  compartidas.delete("notificaciones");
  return { message: "Notificación eliminada" };
};

// ── Categorías de producto ────────────────────────────────────────────────
export const getCategorias = async (cliente: Cliente = supabase) =>
  datos(await cliente.from("categoria_producto").select("*").order("nombre"));

// ── Proveedores ───────────────────────────────────────────────────────────
export const getProveedores = async (cliente: Cliente = supabase) =>
  datos(await cliente.from("proveedores").select("*").eq("activo", true).order("nombre"));

export const getProveedorById = async (id: number, cliente: Cliente = supabase) =>
  datos(await cliente.from("proveedores").select("*").eq("proveedor_id", id).single());

type ProveedorInput = {
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  activo?: boolean;
};

export const createProveedor = async ({ nombre, telefono, email, direccion }: ProveedorInput) =>
  datos(
    await supabase
      .from("proveedores")
      .insert({ nombre, telefono, email, direccion })
      .select()
      .single()
  );

export const updateProveedor = async (id: number, data: ProveedorInput) => {
  const { nombre, telefono, email, direccion, activo } = data;
  const [proveedor] = conFilas(
    await supabase
      .from("proveedores")
      .update({ nombre, telefono, email, direccion, activo })
      .eq("proveedor_id", id)
      .select()
  );
  return proveedor;
};

// Baja logica para no romper la relacion con productos
export const deleteProveedor = async (id: number) => {
  conFilas(
    await supabase.from("proveedores").update({ activo: false }).eq("proveedor_id", id).select()
  );
  return { message: "Proveedor desactivado correctamente" };
};

// ── Ventas ────────────────────────────────────────────────────────────────
type ItemVenta = { producto_id: number; cantidad: number };

export const getVentas = async (cliente: Cliente = supabase) => {
  const filas = datos(
    await cliente
      .from("ventas")
      .select("venta_id, usuario_id, total, fecha_venta, perfiles(nombre)")
      .order("fecha_venta", { ascending: false })
  );
  return filas.map(({ perfiles, ...v }) => ({ ...v, usuario_nombre: perfiles?.nombre ?? null }));
};

export const getVentaDetalles = async (id: string | number, cliente: Cliente = supabase) => {
  const venta = datos(
    await cliente
      .from("ventas")
      .select(
        "venta_id, fecha_venta, total, usuario_id, perfiles(nombre), detalle_venta(detalle_id, venta_id, producto_id, cantidad, precio_unitario, subtotal, productos(nombre))"
      )
      .eq("venta_id", Number(id))
      .order("detalle_id", { referencedTable: "detalle_venta" })
      .single()
  );

  const { detalle_venta, perfiles, ...cabecera } = venta;
  return {
    ...cabecera,
    usuario_nombre: perfiles?.nombre ?? null,
    detalles: detalle_venta.map(({ productos, ...d }) => ({
      ...d,
      nombre_producto: productos?.nombre ?? null,
    })),
  };
};

// El precio y el total los calcula la base de datos; solo se envia producto y cantidad
export const createVenta = async (items: ItemVenta[]) => {
  const id = datos(await supabase.rpc("crear_venta", { p_items: items }));
  return { id, message: "Venta creada exitosamente" };
};

export const updateVenta = async (
  id: string | number,
  data: { items: ItemVenta[]; [campo: string]: unknown }
) => {
  const items = data.items.map(({ producto_id, cantidad }) => ({ producto_id, cantidad }));
  datos(await supabase.rpc("editar_venta", { p_venta_id: Number(id), p_items: items }));
  return { message: "Venta actualizada correctamente" };
};

// Anula la venta y devuelve el stock
export const deleteVenta = async (id: string | number) => {
  datos(await supabase.rpc("anular_venta", { p_venta_id: Number(id) }));
  return { message: "Venta anulada y stock restaurado correctamente" };
};

// ── Gastos ────────────────────────────────────────────────────────────────
type GastoInput = { categoria_id?: number | null; descripcion: string; monto: number };

const aplanarGasto = <
  G extends { categoria_gasto?: { nombre: string } | null; perfiles?: { nombre: string } | null },
>({
  categoria_gasto,
  perfiles,
  ...gasto
}: G) => ({
  ...gasto,
  categoria_nombre: categoria_gasto?.nombre ?? null,
  usuario_nombre: perfiles?.nombre ?? null,
});

export const getGastos = async (cliente: Cliente = supabase) => {
  const filas = datos(
    await cliente
      .from("gastos")
      .select("*, categoria_gasto(nombre), perfiles(nombre)")
      .order("fecha_gasto", { ascending: false })
  );
  return filas.map(aplanarGasto);
};

export const getCategoriasGasto = async (cliente: Cliente = supabase) =>
  datos(await cliente.from("categoria_gasto").select("*").order("nombre"));

export const createGasto = async ({ categoria_id, descripcion, monto }: GastoInput) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const gasto = datos(
    await supabase
      .from("gastos")
      .insert({ usuario_id: user?.id ?? null, categoria_id: categoria_id ?? null, descripcion, monto })
      .select("*, categoria_gasto(nombre)")
      .single()
  );
  return { message: "Gasto registrado exitosamente", gasto: aplanarGasto(gasto) };
};

export const updateGasto = async (id: number, { categoria_id, descripcion, monto }: GastoInput) => {
  const [gasto] = conFilas(
    await supabase
      .from("gastos")
      .update({ categoria_id: categoria_id ?? null, descripcion, monto })
      .eq("gasto_id", id)
      .select()
  );
  return { message: "Gasto actualizado correctamente", gasto };
};

export const deleteGasto = async (id: number) => {
  conFilas(await supabase.from("gastos").delete().eq("gasto_id", id).select());
  return { message: "Gasto eliminado correctamente" };
};

// ── Dashboard ─────────────────────────────────────────────────────────────
export const getDashboardStats = async (
  periodo: "semana" | "mes" | "año" = "mes",
  cliente: Cliente = supabase
) => datos(await cliente.rpc("dashboard_stats", { p_periodo: periodo })) as unknown as DashboardStats;

export const getBalanceHistorico = async (cliente: Cliente = supabase) =>
  datos(await cliente.rpc("balance_historico")) as unknown as BalanceHistorico;

// ── Usuarios ──────────────────────────────────────────────────────────────
// El email vive en auth.users: lo entrega la funcion listar_usuarios (solo dueño)
export const getUsuarios = async (cliente: Cliente = supabase) => datos(await cliente.rpc("listar_usuarios"));

// Baja logica: el perfil queda inactivo y RLS le corta el acceso a los datos
export const deleteUsuario = async (id: string) => {
  conFilas(await supabase.from("perfiles").update({ estado: "inactivo" }).eq("id", id).select());
  return { message: "Usuario desactivado", usuario_id: id };
};

// ── Sesión ────────────────────────────────────────────────────────────────
let nombreEnCache: { id: string; nombre: Promise<string> } | null = null;

// Nombre del usuario logueado, tomado de su perfil. Se cachea por id de sesión y la promesa
// se guarda antes de resolverse, así las llamadas simultáneas (Navbar + página) hacen una sola consulta
export const getNombreUsuario = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const id = session?.user.id;
  if (!id) return "Usuario";

  if (nombreEnCache?.id !== id) {
    const nombre = (async () => {
      const { data } = await supabase.from("perfiles").select("nombre").eq("id", id).maybeSingle();
      return data?.nombre ?? "Usuario";
    })();
    nombreEnCache = { id, nombre };
  }
  return nombreEnCache.nombre;
};

export const cerrarSesion = async () => {
  nombreEnCache = null;
  compartidas.clear();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
