// @/types/types.ts

export interface Producto {
  producto_id: number;
  nombre: string;
  precio: number;
  stock: number;
  stock_minimo?: number;
  categoria?: string;
  categoria_id?: number;
  proveedor_id?: number;
  imagen_url?: string;
  activo: boolean;
}

export interface Categoria {
  categoria_id: number;
  nombre: string;
}

export interface Proveedor {
  proveedor_id: number;
  nombre: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo?: boolean;
  fecha_creacion?: number;
}

export interface Venta {
  venta_id: number;
  usuario_id: number;
  producto_id: number;
  total: number;
  fecha_venta: string;
  usuario_nombre?: string;
}

export interface VentaExitosa {
  id: number;
  total: number;
  items: CartItem[];
}

export interface DetalleVenta {
  detalle_id: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  nombre_producto?: string;
  imagen_url?: string;
}

export interface Alerta {
  notificacion_id: number;
  mensaje: string;
  tipo: 'stock' | 'vencimiento' | 'otro';
  leida: boolean;
  fecha: string;
}

export interface CartItem extends Producto {
  cantidad: number;
}

export interface ProductoFormInput {
  nombre: string;
  precio: string | number;
  stock: string | number;
  stock_minimo: string | number;
  categoria_id: string | number;
  proveedor_id: string | number;
}

// ── Gastos ────────────────────────────────────────────────────────────────

export interface CategoriaGasto {
  categoria_id: number;
  nombre: string;
}

export interface Gasto {
  gasto_id: number;
  usuario_id?: number;
  categoria_id?: number;
  descripcion: string;
  monto: number;
  fecha_gasto: string;
  categoria_nombre?: string;
  usuario_nombre?: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────

export interface TopProducto {
  producto_id: number;
  nombre: string;
  total_vendido: number;
  total_monto: number;
  porcentaje: number;
}

export interface FlujoCajaPunto {
  label: string;
  ingresos: number;
  num_ventas: number;
}

export interface GastoDistribucion {
  categoria: string;
  total: number;
  cantidad?: number;
  porcentaje: number;
}

export interface DashboardStats {
  periodo: string;
  totalIngresos: number;
  totalVentas: number;
  totalGastos: number;
  utilidadNeta: number;
  ticketPromedio: number;
  margenGanancia: number;
  topProductos: TopProducto[];
  flujoCaja: FlujoCajaPunto[];
  gastosDistribucion: GastoDistribucion[];
}

// ── Balance ───────────────────────────────────────────────────────────────

export interface BalanceMes {
  mes: string;
  ingresos: number;
  gastos: number;
  utilidad: number;
  margen: number;
  ventas: number;
}

export interface BalanceHistorico {
  mesActual: BalanceMes;
  cambioIngresos: number;
  cambioGastos: number;
  historico: BalanceMes[];
  gastosDistribucion: GastoDistribucion[];
}