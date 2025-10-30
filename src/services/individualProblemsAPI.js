import axios from "axios";
import api from "./api";

// Add token to request headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const individualProblemsAPI = {
  getAllProblems: () =>
    api.get("/api/individual-problems", { headers: getAuthHeaders() }),
  getProblemById: (id) =>
    api.get(`/api/individual-problems/${id}`, { headers: getAuthHeaders() }),
  createProblem: (problemData) =>
    api.post("/api/individual-problems", problemData, {
      headers: getAuthHeaders(),
    }),
  updateProblem: (id, problemData) =>
    api.put(`/api/individual-problems/${id}`, problemData, {
      headers: getAuthHeaders(),
    }),
  deleteProblem: (id) =>
    api.delete(`/api/individual-problems/${id}`, { headers: getAuthHeaders() }),
};

export default individualProblemsAPI;
