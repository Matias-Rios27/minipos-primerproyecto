// Define esto fuera de tu componente
interface Producto {
  producto_id: number;
  nombre: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  imagen_url?: string;
}

interface Alerta {
  notificacion_id: number;
  tipo: string;
  mensaje: string;
}

interface CartItem {
  producto_id: number;
  nombre: string;
  cantidad: number;  // Antes tenías 'qty'
  precio: number;    // Antes tenías 'price'
}