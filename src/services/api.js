import axios from "axios";

// Log the API base URL for debugging
console.log("VITE_API_BASE_URL from env:", import.meta.env.VITE_API_BASE_URL);
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
console.log("Using API base URL:", apiBaseUrl);

// Validate that we're not using localhost in production
if (import.meta.env.PROD && apiBaseUrl.includes("localhost")) {
  console.warn("WARNING: Using localhost API URL in production environment!");
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include token in headers if available
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  signup: (userData) => api.post("/api/auth/signup", userData),
  login: (credentials) => api.post("/api/auth/login", credentials),
};

// Code execution API endpoints
export const codeAPI = {
  executeCode: (codeData) => api.post("/api/code/execute", codeData),
};

export default api;
