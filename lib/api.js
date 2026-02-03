import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000
});

export const getProducts = async () => (await api.get('/api/productos')).data;
export const getNotificaciones = async () => (await api.get('/api/notificaciones')).data;

export default api;
