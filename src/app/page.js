"use client";
import Header from "@/componentes/Header";
import estilos from "./page.module.css";
import Footer from "@/componentes/Footer";
import { useEffect, useState } from "react";
import Produto from "@/componentes/Produto";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import Mensagem from "@/componentes/Mensagem";
import { produtoService } from "@/utils/api";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [unidade, setUnidade] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [numeroWhatsApp, setNumeroWhatsApp] = useState("");
  const [mostrarCampoNumero, setMostrarCampoNumero] = useState(false);
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);

  // Paginação
  const itensPorPagina = 8;
  const totalPaginas = Math.max(1, Math.ceil(produtos.length / itensPorPagina));
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPaginados = produtos.slice(inicio, fim);

  // Exibir e limpar mensagens
  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => {
        setMensagem({ texto: "", tipo: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  useEffect(() => {
    if (!usuario) {
      router.push("/login");
    }
  }, [usuario, router]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, produtos, totalPaginas]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await produtoService.obterTodos();

        const listaOrdenada = resposta.data.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );

        setProdutos(listaOrdenada);
      } catch (erro) {
        console.error("Erro ao buscar produtos", erro);
        setMensagem({ texto: "Falha ao carregar produtos!", tipo: "erro" });
      }
    }

    carregarProdutos();
  }, []);

  //Adiciona produto no banco
  async function handeAdicionarProduto() {
    if (
      nome === "" ||
      quantidade === "" ||
      descricao === "" ||
      unidade === ""
    ) {
      setMensagem({
        texto: "Preencha todos os campos!",
        tipo: "aviso",
      });
      return;
    }
    try {
      const novoProduto = {
        nome,
        quantidade,
        descricao,
        unidade,
        criado_por: usuario.id,
      };
      const response = await produtoService.criar(novoProduto);
      // produto salvo no backend → add na lista local
      const produtoSalvo = response.data.produto;

      // Atualiza lista apenas com produtos ativos
      const novaLista = [...produtos, produtoSalvo].sort((a, b) =>
        (a.nome || "").localeCompare(b.nome || "")
      );

      setProdutos(novaLista);

      setMensagem({ texto: response.data.mensagem, tipo: "sucesso" });
      setNome("");
      setQuantidade("");
      setDescricao("");
      setUnidade("");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data?.mensagem === "Produto já cadastrado"
      ) {
        setMensagem({
          texto: "Este produto já existe no cadastro!",
          tipo: "aviso",
        });
        // ✅ LIMPA CAMPOS MESMO NA DUPLICIDADE
        setNome("");
        setQuantidade("");
        setDescricao("");
        setUnidade("");
      } else {
        setMensagem({
          texto: "Erro ao cadastrar produto!",
          tipo: "erro",
        });
      }
    }
  }

  // Editar produto (preenche inputs)
  function EditProduto(id) {
    const produtoEditado = produtos.find((p) => p.id === id);
    if (produtoEditado) {
      setNome(produtoEditado.nome);
      setQuantidade(produtoEditado.quantidade);
      setDescricao(produtoEditado.descricao);
      setUnidade(produtoEditado.unidade);
      setEditando(true);
      setProdutoEditandoId(id);
      const produtosAtualizados = produtos.map((p) =>
        p.id === id ? { ...p, edit: true } : { ...p, edit: false }
      );
      setProdutos(produtosAtualizados);
    }
  }

  async function SalvarEdicao() {
    if (!produtoEditandoId) return;

    try {
      // Dados que vão para o backend
      const dadosAtualizados = {
        nome,
        quantidade,
        descricao,
        unidade,
        atualizado_por: usuario.id,
        status: "ativo",
      };

      // Atualiza no backend
      await produtoService.atualizar(produtoEditandoId, dadosAtualizados);

      // Atualiza lista no frontend
      const produtosAtualizados = produtos
        .map((produto) =>
          produto.id === produtoEditandoId
            ? { ...produto, ...dadosAtualizados, edit: false } // substitui produto editado
            : produto
        )
        .sort((a, b) => a.nome.localeCompare(b.nome)); // mantém ordenado por nome

      setProdutos(produtosAtualizados);

      // Mostra mensagem de sucesso vinda do backend
      setMensagem({
        texto:"Produto editado com sucesso!",
        tipo: "sucesso",
      });

      // Limpa estado de edição
      setEditando(false);
      setProdutoEditandoId(null);
      setNome("");
      setQuantidade("");
      setDescricao("");
      setUnidade("");
    } catch (erro) {
      console.error("Erro ao atualizar produto:", erro);
      setMensagem({ texto: "Falha ao atualizar produto!", tipo: "erro" });
    }
  }

  async function DeleteProduto(id) {
    // Pega o produto para mostrar na mensagem
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;

    try {
      // Chama API para remover (soft delete)
      await produtoService.remover(id); // token JWT enviado pelo interceptor

      // Atualiza lista local removendo o produto
      const novaLista = produtos.filter((p) => p.id !== id);
      setProdutos(novaLista);

      // Mensagem de sucesso com nome do produto
      setMensagem({
        texto: `Produto "${produto.nome}" deletado com sucesso!`,
        tipo: "sucesso",
      });
    } catch (erro) {
      console.error("Erro ao deletar produto:", erro);

      // Mensagem de erro
      setMensagem({
        texto: `Falha ao deletar produto "${produto.nome}"!`,
        tipo: "erro",
      });
    }
  }

  // Marcar produto como "checado"
  function checkProduto(id) {
    const atualizados = produtos.map((p) =>
      p.id === id ? { ...p, checado: !p.checado } : p
    );
    setProdutos(atualizados);
  }

  return (
    <div className={estilos.containerPrincipal}>
      <Header titulo="Lista de compras do mensal" />

      <Mensagem mensagem={mensagem} />

      <main>
        <div className={estilos.container_input}>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={estilos.input}
            type="text"
            placeholder="Nome Produto"
          />
          <input
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className={estilos.input}
            type="number"
            placeholder="Quantidade "
          />
          <input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={estilos.input}
            type="text"
            placeholder="Descrição"
          />
          <select
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
            className={estilos.input}
          >
            <option value="">Selecione a unidade</option>
            <option value="un">Unidade</option>
            <option value="kg">Kilo</option>
            <option value="lt">Litro</option>
            <option value="cx">Caixa</option>
            <option value="m">Metro</option>
            <option value="g">Grama</option>
            <option value="pc">Pacote</option>
          </select>

          <button
            onClick={editando ? SalvarEdicao : handeAdicionarProduto}
            className={`${estilos.btn} ${
              editando ? estilos.editar : estilos.adicionar
            }`}
          >
            {editando ? "Salvar Produto" : "Adicionar Produto"}
          </button>
        </div>
        <div className={estilos.container}>
          <table className={estilos.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Descrição</th>
                <th>Unidade</th>

                <th className={estilos.tabela_th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosPaginados.map((produto) => (
                <Produto
                  key={produto.id}
                  id={produto.id}
                  nome={produto.nome}
                  editando={editando}
                  checado={produto.checado}
                  quantidade={produto.quantidade}
                  descricao={produto.descricao}
                  unidade={produto.unidade}
                  onClickDelete={DeleteProduto}
                  onClickEdit={EditProduto}
                  onClickCheck={checkProduto}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className={estilos.paginacao}>
          <button
            onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
            disabled={paginaAtual === 1}
          >
            <IconMinus size={20} />
          </button>
          <span className={estilos.texto}>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
          >
            <IconPlus size={20} />
          </button>
        </div>
      </main>
      <Footer subtitulo="&copy;Desenvolvido por: DevSouza Julho 2025 atualizado em: 01 Janeiro 2026" />
    </div>
  );
}
