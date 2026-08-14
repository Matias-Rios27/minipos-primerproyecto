import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000,
});

// ── Interceptor: adjunta el JWT a cada request ────────────────────────────
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Productos ─────────────────────────────────────────────────────────────
export const getProducts      = async () => (await api.get("/api/productos")).data;
export const getProductById   = async (id: number) => (await api.get(`/api/productos/${id}`)).data;
export const createProducto   = async (formData: FormData) =>
  (await api.post("/api/productos", formData, { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateProducto   = async (id: number, formData: FormData) =>
  (await api.put(`/api/productos/${id}`, formData)).data;
export const deleteProduct    = async (id: number) =>
  (await api.delete(`/api/productos/${id}`)).data;

// ── Notificaciones ────────────────────────────────────────────────────────
export const getNotificaciones  = async () => (await api.get("/api/notificaciones")).data;
export const deleteNotificacion = async (id: number) =>
  (await api.delete(`/api/notificaciones/${id}`)).data;

// ── Categorías de producto ────────────────────────────────────────────────
export const getCategorias = async () => (await api.get("/api/categorias")).data;

// ── Proveedores ───────────────────────────────────────────────────────────
export const getProveedores     = async () => (await api.get("/api/proveedores")).data;
export const getProveedorById   = async (id: number) => (await api.get(`/api/proveedores/${id}`)).data;
export const createProveedor    = async (data: any) => (await api.post("/api/proveedores", data)).data;
export const updateProveedor    = async (id: number, data: any) =>
  (await api.put(`/api/proveedores/${id}`, data)).data;
export const deleteProveedor    = async (id: number) =>
  (await api.delete(`/api/proveedores/${id}`)).data;

// ── Ventas ────────────────────────────────────────────────────────────────
export const getVentas       = async () => (await api.get("/api/ventas")).data;
export const getVentaDetalles = async (id: string | number) =>
  (await api.get(`/api/ventas/${id}`)).data;
export const createVenta     = async (data: { usuario_id: number; total: number; items: any[] }) =>
  (await api.post("/api/ventas", data)).data;
export const updateVenta     = async (id: string | number, data: any) =>
  (await api.put(`/api/ventas/${id}`, data)).data;
export const deleteVenta     = async (id: string | number) =>
  (await api.delete(`/api/ventas/${id}`)).data;

// ── Gastos ────────────────────────────────────────────────────────────────
export const getGastos         = async () => (await api.get("/api/gastos")).data;
export const getCategoriasGasto = async () => (await api.get("/api/gastos/categorias")).data;
export const createGasto       = async (data: {
  usuario_id?: number;
  categoria_id?: number;
  descripcion: string;
  monto: number;
}) => (await api.post("/api/gastos", data)).data;
export const updateGasto       = async (id: number, data: any) =>
  (await api.put(`/api/gastos/${id}`, data)).data;
export const deleteGasto       = async (id: number) =>
  (await api.delete(`/api/gastos/${id}`)).data;

// ── Dashboard ─────────────────────────────────────────────────────────────
export const getDashboardStats = async (periodo: "semana" | "mes" | "año" = "mes") =>
  (await api.get(`/api/dashboard?periodo=${periodo}`)).data;

export const getBalanceHistorico = async () =>
  (await api.get("/api/dashboard/balance")).data;

// ── Usuarios ──────────────────────────────────────────────────────────────
export const getUsuarios    = async () => (await api.get("/api/usuarios")).data;
export const createUsuario  = async (data: any) => (await api.post("/api/usuarios", data)).data;
export const updateUsuario  = async (id: number, data: any) =>
  (await api.put(`/api/usuarios/${id}`, data)).data;
export const deleteUsuario  = async (id: number) =>
  (await api.delete(`/api/usuarios/${id}`)).data;

export default api;
