import axios from "axios";

// Codeforces API base URL
const CODEFORCES_API_BASE = "https://codeforces.com/api";

// Create axios instance with base configuration
const codeforcesAPI = axios.create({
  baseURL: CODEFORCES_API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// API endpoints
export const codeforcesAPIEndpoints = {
  // Fetch all problems
  getProblems: () => codeforcesAPI.get("/problemset.problems"),

  // Fetch a specific problem
  getProblem: (problemsetName, problemIndex) =>
    codeforcesAPI.get(`/problemset.problem`, {
      params: {
        problemsetName,
        problemIndex,
      },
    }),

  // Fetch contest list
  getContestList: () => codeforcesAPI.get("/contest.list"),

  // Fetch contest standings
  getContestStandings: (contestId, from = 1, count = 100) =>
    codeforcesAPI.get("/contest.standings", {
      params: {
        contestId,
        from,
        count,
      },
    }),

  // Fetch user status (submissions)
  getUserStatus: (handle, from = 1, count = 100) =>
    codeforcesAPI.get("/user.status", {
      params: {
        handle,
        from,
        count,
      },
    }),

  // Fetch user info
  getUserInfo: (handles) =>
    codeforcesAPI.get("/user.info", {
      params: {
        handles: Array.isArray(handles) ? handles.join(";") : handles,
      },
    }),
};

// Helper function to transform Codeforces problem data to our format
export const transformProblemData = (codeforcesProblem) => {
  // Map Codeforces difficulty (rating) to our difficulty levels
  const getDifficultyFromRating = (rating) => {
    if (!rating) return "Unknown";
    if (rating < 1200) return "Easy";
    if (rating < 1600) return "Medium";
    return "Hard";
  };

  // Map Codeforces tags to our tags
  const mapTags = (tags) => {
    return tags.map((tag) => {
      // Capitalize first letter of each tag
      return tag.charAt(0).toUpperCase() + tag.slice(1);
    });
  };

  return {
    id: `${codeforcesProblem.contestId}-${codeforcesProblem.index}`,
    contestId: codeforcesProblem.contestId,
    index: codeforcesProblem.index,
    title: `${codeforcesProblem.name}`,
    description: codeforcesProblem.name, // We'll use the name as description for now
    difficulty: getDifficultyFromRating(codeforcesProblem.rating),
    points: codeforcesProblem.rating || 1000,
    timeLimit: codeforcesProblem.timeLimit || 2,
    memoryLimit: codeforcesProblem.memoryLimit || 256,
    acceptanceRate: 0, // Codeforces doesn't provide this directly
    solved: false, // We don't track this on the frontend yet
    tags: mapTags(codeforcesProblem.tags),
    rating: codeforcesProblem.rating, // Keep original rating for sorting
  };
};

// Helper function to transform Codeforces contest data to our format
export const transformContestData = (codeforcesContest) => {
  // Map Codeforces contest phase to our status
  const getStatusFromPhase = (phase) => {
    switch (phase) {
      case "BEFORE":
        return "Upcoming";
      case "CODING":
        return "Running";
      case "PENDING_SYSTEM_TEST":
        return "System Test";
      case "SYSTEM_TEST":
        return "System Test";
      case "FINISHED":
        return "Finished";
      default:
        return "Unknown";
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return {
    id: codeforcesContest.id,
    name: codeforcesContest.name,
    type: codeforcesContest.type,
    phase: codeforcesContest.phase,
    status: getStatusFromPhase(codeforcesContest.phase),
    duration: Math.floor(codeforcesContest.durationSeconds / 60), // Convert to minutes
    startTime: formatDate(codeforcesContest.startTimeSeconds),
    relativeTime: codeforcesContest.relativeTimeSeconds,
    preparedBy: codeforcesContest.preparedBy,
    websiteUrl: `https://codeforces.com/contest/${codeforcesContest.id}`,
    description: codeforcesContest.name,
  };
};

// Helper function to transform user info
export const transformUserInfo = (codeforcesUser) => {
  return {
    handle: codeforcesUser.handle,
    email: codeforcesUser.email,
    firstName: codeforcesUser.firstName,
    lastName: codeforcesUser.lastName,
    country: codeforcesUser.country,
    city: codeforcesUser.city,
    organization: codeforcesUser.organization,
    contribution: codeforcesUser.contribution,
    rank: codeforcesUser.rank,
    rating: codeforcesUser.rating,
    maxRating: codeforcesUser.maxRating,
    lastOnlineTime: new Date(
      codeforcesUser.lastOnlineTimeSeconds * 1000
    ).toLocaleString(),
    registrationTime: new Date(
      codeforcesUser.registrationTimeSeconds * 1000
    ).toLocaleString(),
  };
};

export default codeforcesAPI;
