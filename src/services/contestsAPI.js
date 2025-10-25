import axios from "axios";

// Create an axios instance with default configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api", // Assuming backend runs on port 5000
});

// Add a request interceptor to include auth token if available
API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token"); // Changed from localStorage to sessionStorage
  console.log("Token from sessionStorage:", token); // Debug log
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request headers:", req.headers); // Debug log
  return req;
});

// Helper function to format problem data for the backend
const formatProblemData = (problem) => {
  // Ensure all required fields have default values
  return {
    title: problem.title || "",
    topic: problem.topic || "",
    difficulty: problem.difficulty || "Easy",
    description: problem.description || "",
    example1: problem.example1
      ? {
          input: problem.example1.input || "",
          output: problem.example1.output || "",
        }
      : { input: "", output: "" },
    example2: problem.example2
      ? {
          input: problem.example2.input || "",
          output: problem.example2.output || "",
        }
      : { input: "", output: "" },
    constraints: problem.constraints || "",
    points: problem.points || 100,
    timeLimit: problem.timeLimit || 2,
    memoryLimit: problem.memoryLimit || 256,
  };
};

// Contest API functions
export const contestAPI = {
  // Create a new contest
  createContest: (contestData) => {
    // Format the contest data to match backend expectations
    // Note: createdBy is now handled by the backend using the authenticated user
    const formattedData = {
      title: contestData.title || "",
      description: contestData.description || "",
      startDate: contestData.startDate || "",
      startTime: contestData.startTime || "",
      duration: contestData.duration || 90,
      difficulty: contestData.difficulty || "Medium",
      problems: Array.isArray(contestData.problems)
        ? contestData.problems.map(formatProblemData)
        : [],
    };

    console.log(
      "Sending formatted data to backend:",
      JSON.stringify(formattedData, null, 2)
    );
    return API.post("/contests", formattedData);
  },

  // Get all contests
  getAllContests: () => {
    console.log("Fetching all contests");
    return API.get("/api/contests");
  },

  // Get a specific contest by ID
  getContestById: (id) => {
    console.log("Fetching contest by ID:", id);
    return API.get(`/api/contests/${id}`);
  },

  // Get all problems from all contests
  getAllProblems: () => {
    console.log("Fetching all problems");
    return API.get("/api/contests/problems/all");
  },

  // Get a specific problem by contest ID and problem ID
  getProblemById: (contestId, problemId) => {
    console.log("Fetching problem by contest ID and problem ID:", contestId, problemId);
    return API.get(`/api/contests/problems/${contestId}/${problemId}`);
  },
};

export default contestAPI;
