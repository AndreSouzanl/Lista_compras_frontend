"use client";

import estilos from "./Header.module.css";
import { useAuth } from "@/context/AuthContext";

export default function Header({ titulo }) {
  const { usuario, logout } = useAuth();

  return (
    <header className={estilos.container_header}>
      <h1>{titulo}</h1>

      {usuario && (
        <div className={estilos.usuario}>
          <span>Olá, {usuario.nome}</span>
          <button onClick={logout} className={estilos.btnSair}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
}
