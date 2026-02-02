"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import axios, { type AxiosInstance } from "axios";

type User = {
  usuario_id: number;
  nombre: string;
  email: string;
  password_hash: string;
};

export default function Users() {
  const [usuarios, setUsers] = useState<User[]>([]); // Esto ya lo tienes, está bien.

useEffect(() => {
  api.get("/api/usuarios")
    .then(response => {
      // Accedemos a la propiedad .data dentro de la respuesta
      const listaUsuarios = response.data.data; 

      if (Array.isArray(listaUsuarios)) {
        setUsers(listaUsuarios);
      } else {
        console.error("No se encontró el array en response.data.data", response.data);
      }
    })
    .catch((err) => console.error("Error en la petición:", err));
}, []);

  return (
    <div>
      <h2>Usuarios</h2>
      {usuarios.map((u) => (
        <div key={u.usuario_id}>
          {" "}
          {u.nombre} – {u.email} - {u.password_hash}
        </div>
      ))}
    </div>
  );
}
