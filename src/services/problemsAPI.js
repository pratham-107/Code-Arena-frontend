import axios from "axios";
import api from "./api";

// Add token to request headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const problemsAPI = {
  getAllProblems: () => api.get("/api/problems", { headers: getAuthHeaders() }),
  getProblemById: (id) => api.get(`/api/problems/${id}`, { headers: getAuthHeaders() }),
  createProblem: (problemData) => api.post("/api/problems", problemData, { headers: getAuthHeaders() }),
  updateProblem: (id, problemData) => api.put(`/api/problems/${id}`, problemData, { headers: getAuthHeaders() }),
  deleteProblem: (id) => api.delete(`/api/problems/${id}`, { headers: getAuthHeaders() }),
};

export default problemsAPI;
