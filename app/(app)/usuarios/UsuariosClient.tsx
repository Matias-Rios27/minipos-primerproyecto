"use client";

import { useIsDark } from "@/app/components/ThemeProvider";
import { useEffect, useState, useMemo } from "react";
import { deleteUsuario } from "@/lib/api";

export type User = {
  usuario_id: string;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  fecha_creacion: string;
};

export default function UsuariosClient({ usuariosIniciales }: { usuariosIniciales: User[] }) {
  const [usuarios, setUsers] = useState<User[]>(usuariosIniciales);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useIsDark();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

  }, []);

  const filteredUsers = useMemo(() => {
    return usuarios.filter(
      (u) =>
        u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usuarios, searchTerm]);

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("¿Estás seguro de desactivar este usuario?")) {
      try {
        await deleteUsuario(id);
        setUsers(usuarios.map((u) => (u.usuario_id === id ? { ...u, estado: "inactivo" } : u)));
      } catch (e) {
        alert("Error al eliminar usuario.");
      }
    }
  };

  return (
    <div className={`flex flex-col flex-1 min-h-0 font-sans overflow-hidden ${isDark ? "bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header de Sección */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight">Gestión de Usuarios</h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Administración de accesos y roles del sistema MiniPOS
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-2.5 pl-10 pr-4 text-xs font-bold rounded-xl border outline-none transition-all ${
                  isDark ? "bg-slate-800/80 border-slate-700 focus:border-blue-500 text-white" : "bg-white border-slate-200 focus:border-blue-600"
                }`}
              />
              <svg className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className={`rounded-2xl border overflow-hidden shadow-sm ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b font-black uppercase tracking-wider ${isDark ? "bg-slate-900/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Usuario</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Rol</th>
                    <th className="py-4 px-6 text-center">Estado</th>
                    <th className="py-4 px-6 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/10">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.usuario_id} className={`transition-colors ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/80"}`}>
                        <td className="py-4 px-6 font-mono opacity-50">#{user.usuario_id.slice(0, 8)}</td>
                        <td className="py-4 px-6 font-bold flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black flex items-center justify-center text-xs border border-blue-500/20">
                            {user.nombre?.substring(0, 2).toUpperCase() || "US"}
                          </div>
                          <span>{user.nombre}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-medium">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 text-[10px]">
                            {user.rol || "Administrador"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              user.estado === "activo"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-slate-500/10 text-slate-500"
                            }`}
                          >
                            {user.estado === "activo" ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteUser(user.usuario_id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Desactivar usuario"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                        No se encontraron usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
