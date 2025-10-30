import axios from "axios";
import api from "./api";

// Add token to request headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const solutionsAPI = {
  getAllSolutions: () =>
    api.get("/api/solutions", { headers: getAuthHeaders() }),
  getSolutionById: (id) =>
    api.get(`/api/solutions/${id}`, { headers: getAuthHeaders() }),
  createSolution: (solutionData) =>
    api.post("/api/solutions", solutionData, { headers: getAuthHeaders() }),
  updateSolution: (id, solutionData) =>
    api.put(`/api/solutions/${id}`, solutionData, {
      headers: getAuthHeaders(),
    }),
  deleteSolution: (id) =>
    api.delete(`/api/solutions/${id}`, { headers: getAuthHeaders() }),
};

export default solutionsAPI;
