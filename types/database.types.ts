// Tipos de la base de datos Supabase (proyecto mini-pos).
// Generado con generate_typescript_types; regenerar cuando cambie el esquema.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      categoria_gasto: {
        Row: {
          categoria_id: number
          nombre: string
        }
        Insert: {
          categoria_id?: number
          nombre: string
        }
        Update: {
          categoria_id?: number
          nombre?: string
        }
        Relationships: []
      }
      categoria_producto: {
        Row: {
          categoria_id: number
          nombre: string
        }
        Insert: {
          categoria_id?: number
          nombre: string
        }
        Update: {
          categoria_id?: number
          nombre?: string
        }
        Relationships: []
      }
      detalle_venta: {
        Row: {
          cantidad: number
          detalle_id: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          venta_id: number
        }
        Insert: {
          cantidad: number
          detalle_id?: number
          precio_unitario: number
          producto_id: number
          subtotal: number
          venta_id: number
        }
        Update: {
          cantidad?: number
          detalle_id?: number
          precio_unitario?: number
          producto_id?: number
          subtotal?: number
          venta_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "detalle_venta_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["producto_id"]
          },
          {
            foreignKeyName: "detalle_venta_venta_id_fkey"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventas"
            referencedColumns: ["venta_id"]
          },
        ]
      }
      gastos: {
        Row: {
          categoria_id: number | null
          descripcion: string | null
          fecha_gasto: string
          gasto_id: number
          monto: number
          usuario_id: string | null
        }
        Insert: {
          categoria_id?: number | null
          descripcion?: string | null
          fecha_gasto?: string
          gasto_id?: number
          monto: number
          usuario_id?: string | null
        }
        Update: {
          categoria_id?: number | null
          descripcion?: string | null
          fecha_gasto?: string
          gasto_id?: number
          monto?: number
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gastos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categoria_gasto"
            referencedColumns: ["categoria_id"]
          },
          {
            foreignKeyName: "gastos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones: {
        Row: {
          fecha_creacion: string
          leida: boolean
          mensaje: string | null
          notificacion_id: number
          producto_id: number | null
          tipo: string | null
        }
        Insert: {
          fecha_creacion?: string
          leida?: boolean
          mensaje?: string | null
          notificacion_id?: number
          producto_id?: number | null
          tipo?: string | null
        }
        Update: {
          fecha_creacion?: string
          leida?: boolean
          mensaje?: string | null
          notificacion_id?: number
          producto_id?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["producto_id"]
          },
        ]
      }
      perfiles: {
        Row: {
          estado: string
          fecha_creacion: string
          id: string
          nombre: string
          rol: string
        }
        Insert: {
          estado?: string
          fecha_creacion?: string
          id: string
          nombre: string
          rol?: string
        }
        Update: {
          estado?: string
          fecha_creacion?: string
          id?: string
          nombre?: string
          rol?: string
        }
        Relationships: []
      }
      productos: {
        Row: {
          activo: boolean
          categoria_id: number | null
          fecha_caducidad: string | null
          fecha_creacion: string
          imagen_url: string | null
          nombre: string
          precio: number
          producto_id: number
          proveedor_id: number | null
          stock: number
          stock_minimo: number
        }
        Insert: {
          activo?: boolean
          categoria_id?: number | null
          fecha_caducidad?: string | null
          fecha_creacion?: string
          imagen_url?: string | null
          nombre: string
          precio: number
          producto_id?: number
          proveedor_id?: number | null
          stock?: number
          stock_minimo?: number
        }
        Update: {
          activo?: boolean
          categoria_id?: number | null
          fecha_caducidad?: string | null
          fecha_creacion?: string
          imagen_url?: string | null
          nombre?: string
          precio?: number
          producto_id?: number
          proveedor_id?: number | null
          stock?: number
          stock_minimo?: number
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categoria_producto"
            referencedColumns: ["categoria_id"]
          },
          {
            foreignKeyName: "productos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["proveedor_id"]
          },
        ]
      }
      proveedores: {
        Row: {
          activo: boolean
          direccion: string | null
          email: string | null
          fecha_creacion: string
          nombre: string
          proveedor_id: number
          telefono: string | null
        }
        Insert: {
          activo?: boolean
          direccion?: string | null
          email?: string | null
          fecha_creacion?: string
          nombre: string
          proveedor_id?: number
          telefono?: string | null
        }
        Update: {
          activo?: boolean
          direccion?: string | null
          email?: string | null
          fecha_creacion?: string
          nombre?: string
          proveedor_id?: number
          telefono?: string | null
        }
        Relationships: []
      }
      ventas: {
        Row: {
          fecha_venta: string
          total: number
          usuario_id: string | null
          venta_id: number
        }
        Insert: {
          fecha_venta?: string
          total: number
          usuario_id?: string | null
          venta_id?: number
        }
        Update: {
          fecha_venta?: string
          total?: number
          usuario_id?: string | null
          venta_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ventas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      anular_venta: { Args: { p_venta_id: number }; Returns: undefined }
      balance_historico: { Args: never; Returns: Json }
      crear_venta: { Args: { p_items: Json }; Returns: number }
      dashboard_stats: { Args: { p_periodo?: string }; Returns: Json }
      editar_venta: {
        Args: { p_items: Json; p_venta_id: number }
        Returns: undefined
      }
      listar_usuarios: {
        Args: never
        Returns: {
          email: string
          estado: string
          fecha_creacion: string
          nombre: string
          rol: string
          usuario_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
