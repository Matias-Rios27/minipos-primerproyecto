// Define esto fuera de tu componente
export interface Producto {
  producto_id: number;
  nombre: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  imagen_url?: string;
}

export interface Alerta {
  notificacion_id: number;
  tipo: string;
  mensaje: string;
}

export interface CartItem {
  producto_id: number;
  nombre: string;
  cantidad: number;  
  precio: number;    
}