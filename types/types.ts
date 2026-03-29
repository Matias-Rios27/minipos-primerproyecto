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

// Interfaz para el formulario de nuevo producto
export interface ProductoFormInput {
  nombre: string;
  precio: string | number;
  stock: string | number;
  stock_minimo: string | number;
  categoria_id: string | number;
  proveedor_id: string | number;
}