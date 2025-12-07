import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9000", 
  headers:{
    'Content-Type': 'application/json',
  }
});

export const produtoService = {
  obterTodos: () => api.get("/produtos"),

  criar: (dados) => api.post("/produtos", dados),

  atualizar: (id, dados) => api.put(`/produtos/${id}`, dados),

  remover: (id) => api.delete(`/produtos/${id}`)
};

