import axios from "axios";

// Cria instância da API
export const api = axios.create({
  baseURL: "https://api-produtos-8p05.onrender.com/", 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Adiciona interceptor para sempre enviar token se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // pega token do login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const produtoService = {
  obterTodos: () => api.get("/produtos"),

  criar: (dados) => api.post("/produtos", dados),

  atualizar: (id, dados) => api.put(`/produtos/${id}`, dados),

  remover: (id) => api.delete(`/produtos/${id}`)
};

export const usuarioService = {
  registrar: (dados) => api.post("/usuarios", dados),
  
  recuperarSenha: (email) => api.post("/usuarios/forgot-password", { email }),
  
  alterarSenha: (token, novaSenha) => api.post("/usuarios/reset-password", { token, novaSenha })
};
