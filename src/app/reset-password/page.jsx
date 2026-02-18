"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "../login/page.module.css";
import { usuarioService } from "@/utils/api";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    if (!token) {
      setMensagem({
        texto: "Token inválido ou ausente",
        tipo: "erro",
      });
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!novaSenha || !confirmarSenha) {
      setMensagem({ texto: "Preencha todos os campos", tipo: "erro" });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem({ texto: "As senhas não conferem", tipo: "erro" });
      return;
    }

    try {
      setLoading(true);

      await usuarioService.alterarSenha(token, novaSenha);

      setMensagem({
        texto: "Senha alterada com sucesso! Redirecionando...",
        tipo: "sucesso",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setMensagem({
        texto: "Token inválido ou expirado",
        tipo: "erro",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Redefinir Senha</h1>

        <div className={styles.inputGroup}>
          <label>Nova senha</label>
          <div className={styles.passwordWrapper}>
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <button
              type="button"
              className={styles.showPasswordBtn}
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Confirmar senha</label>
          <div className={styles.passwordWrapper}>
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            <button
              type="button"
              className={styles.showPasswordBtn}
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button
          className={styles.button}
          type="submit"
          disabled={loading || !token}
        >
          {loading ? "Salvando..." : "Alterar senha"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
