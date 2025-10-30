import api from "./api";

// Add token to request headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const communityAPI = {
  getAllPosts: () => api.get("/api/community", { headers: getAuthHeaders() }),
  getPosts: (params) =>
    api.get("/api/community", { headers: getAuthHeaders(), params }),
  getPostById: (id) =>
    api.get(`/api/community/${id}`, { headers: getAuthHeaders() }),
  createPost: (postData) =>
    api.post("/api/community", postData, { headers: getAuthHeaders() }),
  updatePost: (id, postData) =>
    api.put(`/api/community/${id}`, postData, { headers: getAuthHeaders() }),
  deletePost: (id) =>
    api.delete(`/api/community/${id}`, { headers: getAuthHeaders() }),
  likePost: (id) =>
    api.post(`/api/community/${id}/like`, {}, { headers: getAuthHeaders() }),
  getStats: () =>
    api.get("/api/community/stats", { headers: getAuthHeaders() }),
  getCategories: () =>
    api.get("/api/community/categories", { headers: getAuthHeaders() }),
  getComments: (postId) =>
    api.get(`/api/community/${postId}/comments`, { headers: getAuthHeaders() }),
  addComment: (postId, commentData) =>
    api.post(`/api/community/${postId}/comments`, commentData, { headers: getAuthHeaders() }),
};

export default communityAPI;