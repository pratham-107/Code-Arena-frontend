import api from "./api";

// Add token to request headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const communityAPI = {
  getAllPosts: () => api.get("/api/community", { headers: getAuthHeaders() }),
  getPostById: (id) => api.get(`/api/community/${id}`, { headers: getAuthHeaders() }),
  createPost: (postData) => api.post("/api/community", postData, { headers: getAuthHeaders() }),
  updatePost: (id, postData) => api.put(`/api/community/${id}`, postData, { headers: getAuthHeaders() }),
  deletePost: (id) => api.delete(`/api/community/${id}`, { headers: getAuthHeaders() }),
  likePost: (id) => api.post(`/api/community/${id}/like`, {}, { headers: getAuthHeaders() }),
};

export default communityAPI;