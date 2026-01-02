import { api } from "./api";

export const authService = {
  login: (email, senha) => api.post("/login", { email, senha }),
}