"use client";

import { useState } from "react";
import styles from "../login/page.module.css";
import { usuarioService } from "@/utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  // cria as variáveis de estado para os campos do formulário
  const router = useRouter()
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  //função para tratar o envio do formulário
  async function handleRegister(e) {
    
    e.preventDefault();
    //valida se todos os campos estão preenchidos
    if (!nome || !email || !senha) {
      setMensagem({ texto: "Preencha todos os campos", tipo: "erro" });
      return;
    }
    //tenta registrar o usuário
    try {
      await usuarioService.registrar({
        nome,
        email: email.toLocaleLowerCase(),
        senha,
      });

      setMensagem({
        texto: "Cadastro realizado com sucesso!",
        tipo: "sucesso",
      });
      
      setNome("");
      setEmail("");
      setSenha("");

      // 🔁 redireciona para login após 1.5s
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      setMensagem({
        texto: error.response?.data?.mensagem || "Erro ao cadastrar usuário",
        tipo: "erro",
      });
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleRegister}>
        <h1 className={styles.title}>Cadastro seu usuário</h1>

        <div className={styles.inputGroup}>
          <label>Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Senha</label>
          <div className={styles.passwordWrapper}>
            <input
              type={mostrarSenha ? "text" : "password"}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
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
        <button className={styles.button} type="submit">
          Cadastrar
        </button>

        <div className={styles.registerLink}>
          <Link className={styles.link} href="/login">
            voltar ao login
          </Link>
        </div>

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
