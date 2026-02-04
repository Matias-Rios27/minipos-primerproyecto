import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000
});

export const getProducts = async () => (await api.get('/api/productos')).data;

export const createProducto = async (formData: any) => { 
  return (await api.post('/api/productos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data;
};

export const deleteProduct = async (id: number) => {
  return (await api.delete(`/api/productos/${id}`)).data;
};

export const getProductById = async (id: number) => (await api.get(`/api/productos/${id}`)).data;

export const updateProducto = async (id: number, formData: FormData) => {
  const response = await api.put(`/api/productos/${id}`, formData); 
  return response.data;
};

export const getNotificaciones = async () => (await api.get('/api/notificaciones')).data;
export const getCategorias = async () => (await api.get('/api/categorias')).data;
export const getProveedores = async () => (await api.get('/api/proveedores')).data;

export default api;
