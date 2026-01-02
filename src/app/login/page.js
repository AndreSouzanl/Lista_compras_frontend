"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { authService } from "@/utils/authService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState(null);

  

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !senha) {
      setMensagem({ texto: "Preencha todos os campos", tipo: "erro" });
      return;
    }

    try {
      const response = await authService.login(email, senha);
    

       login(response.data.usuario, response.data.token);

      setMensagem({ texto: "Login realizado com sucesso!", tipo: "sucesso" });

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      setMensagem({ texto: "Email ou senha inválidos", tipo: "erro" });
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
        <h1 className={styles.title}>Login</h1>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button className={styles.button} type="submit">
          Entrar
        </button>

        {mensagem && (
          <p
            className={`${styles.message} ${
              mensagem.tipo === "erro" ? styles.error : styles.success
            }`}
          >
            {mensagem.texto}
          </p>
        )}
      </form>
    </div>
  );
}
