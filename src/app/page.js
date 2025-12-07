"use client";
import Header from "@/componentes/Header";
import estilos from "./page.module.css";
import Footer from "@/componentes/Footer";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import Produto from "@/componentes/Produto";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import Mensagem from "@/componentes/Mensagem";
import { produtoService } from "@/utils/api";

export default function Home() {
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
      // return;
    }
    try {
      const novoProduto = {
        nome,
        quantidade,
        descricao,
        unidade,
        criado_por: 3, // ID fixo do usuário por enquanto
      };
      const response = await produtoService.criar(novoProduto);
      // produto salvo no backend → add na lista local
      const produtoSalvo = response.data.produto;

      const novaLista = [...produtos, produtoSalvo].sort((a, b) => {
        const nomeA = a.nome || "";
        const nomeB = b.nome || "";
        return nomeA.localeCompare(nomeB);
      });

      setProdutos(novaLista);
      setMensagem({ texto: "Produto cadastrado!", tipo: "sucesso" });
      setNome("");
      setQuantidade("");
      setDescricao("");
      setUnidade("");
    } catch (error) {
      console.error(error);
      setMensagem({
        texto: "Erro ao cadastrar produto!",
        tipo: "erro",
      });
    }
  }

  // Editar produto (preenche inputs)
  function EditProduto(id) {
    const produtoEditado = produtos.find((p) => p.id === id);
    if (produtoEditado) {
      setNome(produtoEditado.nome);
      setQuantidade(produtoEditado.quantidade);
      setUnidade(produtoEditado.unidade);
      setEditando(true);
      const produtosAtualizados = produtos.map((p) =>
        p.id === id ? { ...p, edit: true } : { ...p, edit: false }
      );
      setProdutos(produtosAtualizados);
    }
  }

  // Salvar edição
  function SalvarEdicao() {
    const produtoEditando = produtos.find((p) => p.edit);
    if (produtoEditando) {
      const produtosAtualizados = produtos
        .map((produto) =>
          produto.id === produtoEditando.id
            ? { ...produto, nome, quantidade, unidade, edit: false }
            : produto
        )
        .sort((a, b) => a.nome.localeCompare(b.nome));
      setProdutos(produtosAtualizados);
      setEditando(false);
      setNome("");
      setQuantidade("");
      setUnidade("");
    }
  }

  // Deletar produto
  function DeleteProduto(id) {
    const novaLista = produtos.filter((produto) => produto.id !== id);
    setProdutos(novaLista);
    setMensagem({ texto: "Produto removido!", tipo: "erro" });
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
      <Header titulo="Lista de Compras Mensal" />

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
      <Footer subtitulo="&copy;Desenvolvido por: DevSouza Julho 2025" />
    </div>
  );
}
