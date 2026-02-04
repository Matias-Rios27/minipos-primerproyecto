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