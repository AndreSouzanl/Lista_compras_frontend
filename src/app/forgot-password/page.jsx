"use client";

import { useState } from "react";
import styles from "../login/page.module.css";
import Link from "next/link";
import { usuarioService } from "@/utils/api"; // ajuste o path se necessário


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      setMensagem({ texto: "Informe seu email", tipo: "erro" });
      return;
    }

    try {
      setLoading(true);

      await usuarioService.recuperarSenha(email);

      setMensagem({
        texto:
          "Se o email existir, enviaremos instruções para redefinir a senha.",
        tipo: "sucesso",
      });
      setEmail("");
    } catch (error) {
      setMensagem({
        texto: "Erro ao solicitar recuperação de senha",
        tipo: "erro",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Recuperar Senha</h1>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
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

        <div className={styles.registerLink}>
          <Link className={styles.link} href="/login">
            Voltar para o login
          </Link>
        </div>
      </form>
    </div>
  );
}
