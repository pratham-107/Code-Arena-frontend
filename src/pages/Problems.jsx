import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Pagination,
  Tabs,
  Tab,
  LinearProgress,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextareaAutosize,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import {
  AccessTime,
  Memory,
  CheckCircle,
  RadioButtonUnchecked,
  Search as SearchIcon,
  PlayArrow,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { contestAPI } from "../services/contestsAPI";
import { problemsAPI } from "../services/problemsAPI";
import { individualProblemsAPI } from "../services/individualProblemsAPI";
import { solutionsAPI } from "../services/solutionsAPI";
import { getCurrentUser } from "../services/auth";

const Problems = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [solvedOnly, setSolvedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addProblemDialogOpen, setAddProblemDialogOpen] = useState(false);
  const [newProblem, setNewProblem] = useState({
    title: "",
    topic: "",
    difficulty: "Easy",
    description: "",
    example1: { input: "", output: "" },
    example2: { input: "", output: "" },
    constraints: "",
    points: 100,
    timeLimit: 2,
    memoryLimit: 256,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const problemsPerPage = 12;

  // Fetch problems from our backend API
  useEffect(() => {
    const fetchProblemsAndSolutions = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, try to fetch individual problems
        try {
          const individualResponse = await individualProblemsAPI.getAllProblems();

          if (individualResponse.data.success && individualResponse.data.data.problems.length > 0) {
            // Use individual problems
            const backendProblems = individualResponse.data.data.problems;

            // Transform problem data to match our format
            const transformedProblems = backendProblems.map((problem) => ({
              id: problem.id,
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty,
              tags: [problem.topic], // Using topic as tag
              points: problem.points,
              timeLimit: problem.timeLimit,
              memoryLimit: problem.memoryLimit,
              rating: problem.points, // Using points as rating
              solved: false, // Default to unsolved
            }));

            // Process user solutions
            const currentUser = getCurrentUser();
            if (currentUser) {
              try {
                const solutionsResponse = await solutionsAPI.getUserSolutions(currentUser.id);
                if (solutionsResponse.data.success) {
                  const userSolutions = solutionsResponse.data.data.solutions;

                  // Mark problems as solved if user has a solution for them
                  const updatedProblems = transformedProblems.map(problem => {
                    const isSolved = userSolutions.some(solution => solution.problemId === problem.id && solution.isSolved);
                    return {
                      ...problem,
                      solved: isSolved
                    };
                  });
                  setProblems(updatedProblems);
                  setLoading(false);
                  return;
                }
              } catch (solutionError) {
                console.error("Error fetching user solutions:", solutionError);
              }
            }

            setProblems(transformedProblems);
            setLoading(false);
            return;
          }
        } catch (individualError) {
          console.log("No individual problems found, falling back to contest problems");
        }

        // Fallback to contest problems (existing behavior)
        const response = await contestAPI.getAllProblems();

        let transformedProblems = [];
        if (response.data.success) {
          // Use problems from our backend
          const backendProblems = response.data.data.problems;

          // Transform problem data to match our format
          transformedProblems = backendProblems.map((problem) => ({
            id: problem.id,
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            tags: [problem.topic], // Using topic as tag
            points: problem.points,
            timeLimit: problem.timeLimit,
            memoryLimit: problem.memoryLimit,
            rating: problem.points, // Using points as rating
            solved: false, // Default to unsolved
          }));
        } else {
          throw new Error("Failed to fetch problems from backend");
        }

        // Fetch user solutions if user is logged in
        const currentUser = getCurrentUser();
        if (currentUser) {
          try {
            const solutionsResponse = await solutionsAPI.getUserSolutions(currentUser.id);
            if (solutionsResponse.data.success) {
              const userSolutions = solutionsResponse.data.data.solutions;

              // Mark problems as solved if user has a solution for them
              transformedProblems = transformedProblems.map(problem => {
                const isSolved = userSolutions.some(solution => solution.problemId === problem.id && solution.isSolved);
                return {
                  ...problem,
                  solved: isSolved
                };
              });
            }
          } catch (solutionError) {
            console.error("Error fetching user solutions:", solutionError);
          }
        }

        setProblems(transformedProblems);
      } catch (err) {
        console.error("Error fetching problems:", err);
        setError("Failed to load problems. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemsAndSolutions();

    // Add event listener for problem solved event
    const handleProblemSolved = () => {
      // Refresh the problems list when a problem is solved
      fetchProblemsAndSolutions();
    };

    window.addEventListener('problemSolved', handleProblemSolved);

    // Clean up event listener
    return () => {
      window.removeEventListener('problemSolved', handleProblemSolved);
    };
  }, []);

  // Filter problems based on search and filters
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesDifficulty =
      difficultyFilter === "" || problem.difficulty === difficultyFilter;
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "solved" && problem.solved) ||
      (statusFilter === "unsolved" && !problem.solved);
    const matchesSolved = !solvedOnly || problem.solved;

    return matchesSearch && matchesDifficulty && matchesStatus && matchesSolved;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const startIndex = (currentPage - 1) * problemsPerPage;
  const currentProblems = filteredProblems.slice(
    startIndex,
    startIndex + problemsPerPage
  );

  // Get solved problems count
  const solvedProblemsCount = problems.filter(problem => problem.solved).length;

  // Get difficulty chip color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "warning";
      case "Hard":
        return "error";
      default:
        return "default";
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1);

    // Set difficulty filter based on tab
    switch (newValue) {
      case 1:
        setDifficultyFilter("Easy");
        break;
      case 2:
        setDifficultyFilter("Medium");
        break;
      case 3:
        setDifficultyFilter("Hard");
        break;
      default:
        setDifficultyFilter("");
    }
  };

  // Handle problem click
  const handleProblemClick = (problemId) => {
    // Check if it's a contest problem (contains '-')
    if (problemId.includes('-')) {
      // Navigate to contest problem detail page
      navigate(`/problems/${problemId}`);
    } else {
      // Navigate to individual problem detail page
      navigate(`/individual-problem/${problemId}`);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setDifficultyFilter("");
    setStatusFilter("");
    setSolvedOnly(false);
    setCurrentPage(1);
  };

  // Handle opening the add problem dialog
  const handleOpenAddProblemDialog = () => {
    setAddProblemDialogOpen(true);
  };

  // Handle closing the add problem dialog
  const handleCloseAddProblemDialog = () => {
    setAddProblemDialogOpen(false);
    // Reset form
    setNewProblem({
      title: "",
      topic: "",
      difficulty: "Easy",
      description: "",
      example1: { input: "", output: "" },
      example2: { input: "", output: "" },
      constraints: "",
      points: 100,
      timeLimit: 2,
      memoryLimit: 256,
    });
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Handle input changes for the new problem form
  const handleNewProblemChange = (field, value) => {
    setNewProblem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle nested object changes (example1, example2)
  const handleNestedChange = (parent, field, value) => {
    setNewProblem(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle adding a new problem
  const handleAddProblem = async () => {
    try {
      // Get current user ID
      const currentUser = getCurrentUser();
      const problemData = {
        ...newProblem,
        createdBy: currentUser ? currentUser.id : "anonymous"
      };

      // Create an individual problem
      const response = await individualProblemsAPI.createProblem(problemData);

      if (response.data.success) {
        // Close dialog
        handleCloseAddProblemDialog();

        // Refresh problems list
        try {
          // Try to fetch individual problems first
          const problemsResponse = await individualProblemsAPI.getAllProblems();
          if (problemsResponse.data.success) {
            const backendProblems = problemsResponse.data.data.problems;
            const transformedProblems = backendProblems.map((problem) => ({
              id: problem.id,
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty,
              tags: [problem.topic],
              points: problem.points,
              timeLimit: problem.timeLimit,
              memoryLimit: problem.memoryLimit,
              rating: problem.points,
              solved: false,
            }));

            // Fetch user solutions again to maintain solved status
            const currentUser = getCurrentUser();
            if (currentUser) {
              try {
                const solutionsResponse = await solutionsAPI.getUserSolutions(currentUser.id);
                if (solutionsResponse.data.success) {
                  const userSolutions = solutionsResponse.data.data.solutions;

                  // Mark problems as solved if user has a solution for them
                  const updatedProblems = transformedProblems.map(problem => {
                    const isSolved = userSolutions.some(solution => solution.problemId === problem.id && solution.isSolved);
                    return {
                      ...problem,
                      solved: isSolved
                    };
                  });
                  setProblems(updatedProblems);
                } else {
                  setProblems(transformedProblems);
                }
              } catch (solutionError) {
                console.error("Error fetching user solutions:", solutionError);
                setProblems(transformedProblems);
              }
            } else {
              setProblems(transformedProblems);
            }
          }
        } catch (error) {
          console.error("Error fetching individual problems:", error);
          // Fallback to contest problems if individual problems fail
          const problemsResponse = await contestAPI.getAllProblems();
          if (problemsResponse.data.success) {
            const backendProblems = problemsResponse.data.data.problems;
            const transformedProblems = backendProblems.map((problem) => ({
              id: problem.id,
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty,
              tags: [problem.topic],
              points: problem.points,
              timeLimit: problem.timeLimit,
              memoryLimit: problem.memoryLimit,
              rating: problem.points,
              solved: false,
            }));

            // Fetch user solutions again to maintain solved status
            const currentUser = getCurrentUser();
            if (currentUser) {
              try {
                const solutionsResponse = await solutionsAPI.getUserSolutions(currentUser.id);
                if (solutionsResponse.data.success) {
                  const userSolutions = solutionsResponse.data.data.solutions;

                  // Mark problems as solved if user has a solution for them
                  const updatedProblems = transformedProblems.map(problem => {
                    const isSolved = userSolutions.some(solution => solution.problemId === problem.id && solution.isSolved);
                    return {
                      ...problem,
                      solved: isSolved
                    };
                  });
                  setProblems(updatedProblems);
                } else {
                  setProblems(transformedProblems);
                }
              } catch (solutionError) {
                console.error("Error fetching user solutions:", solutionError);
                setProblems(transformedProblems);
              }
            } else {
              setProblems(transformedProblems);
            }
          }
        }

        // Show success message
        setSnackbar({
          open: true,
          message: "Problem added successfully!",
          severity: "success",
        });
      } else {
        console.error("Failed to add problem:", response.data.message);
        setSnackbar({
          open: true,
          message: "Failed to add problem: " + response.data.message,
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error adding problem:", err);
      setSnackbar({
        open: true,
        message: "Error adding problem. Please try again.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: "background.default",
          py: 4,
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        py: 4,
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "primary.main",
              }}
            >
              Coding Problems
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Practice and improve your programming skills with real competitive
            programming problems from Codeforces
          </Typography>

        </Box>

        {/* Stats Overview */}
        <Card sx={{ mb: 4, p: 3, backgroundColor: "background.paper" }}>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {problems.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Total Problems
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  {solvedProblemsCount}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Solved
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "warning.main" }}
                >
                  {problems.length > 0
                    ? Math.round(
                      (problems.filter((p) => p.difficulty === "Easy")
                        .length /
                        problems.length) *
                      100
                    )
                    : 0}
                  %
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Easy Problems
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {problems.reduce((sum, problem) => sum + problem.points, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Total Points
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Tabs for different problem categories */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 4,
            "& .MuiTabs-indicator": {
              backgroundColor: "secondary.main",
            },
          }}
        >
          <Tab
            label="All Problems"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="Easy"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="Medium"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="Hard"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        </Tabs>

        {/* Filters */}
        <Card sx={{ mb: 4, p: 3, backgroundColor: "background.paper" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Search Problems"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: <SearchIcon sx={{ color: "text.secondary" }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={difficultyFilter}
                  label="Difficulty"
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    padding: "0 50px",
                  }}
                  MenuProps={{
                    sx: {
                      "& .MuiMenuItem-root": {
                        pl: 5,
                        pr: 5,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    padding: "0 30px",
                  }}
                  MenuProps={{
                    sx: {
                      "& .MuiMenuItem-root": {
                        pl: 7,
                        pr: 7,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="solved">Solved</MenuItem>
                  <MenuItem value="unsolved">Unsolved</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%",
                }}
              >
                <Button onClick={resetFilters} size="small" sx={{ mr: 2 }}>
                  Reset
                </Button>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={solvedOnly}
                      onChange={(e) => setSolvedOnly(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Solved only"
                />
              </Box>

            </Grid>
            <Button
              variant="contained"
              onClick={handleOpenAddProblemDialog}
              sx={{
                backgroundColor: "primary.main",
                color: "secondary.main",
                fontWeight: 700,
                px: 3,
                py: 1,
                ml: "auto",
                fontSize: "1rem",
                borderRadius: 2,
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  backgroundColor: "#333333",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Add Problem
            </Button>
          </Grid>
        </Card>

        {/* Problem Listings */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: '24px',
          mb: 4
        }}>
          {currentProblems.map((problem) => (
            <Card
              key={problem.id}
              sx={{
                height: '100%',
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleProblemClick(problem.id)}
            >
              <CardContent sx={{
                flexGrow: 1,
                p: 3,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                    flexGrow: 1
                  }}
                >
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                          minWidth: 0
                        }}
                      >
                        {problem.title}
                      </Typography>
                      <Chip
                        label={problem.difficulty}
                        color={getDifficultyColor(problem.difficulty)}
                        size="small"
                        sx={{ fontWeight: 600, flexShrink: 0 }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {problem.description}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {problem.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            borderColor: "primary.main",
                            color: "primary.main",
                            maxWidth: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        />
                      ))}
                      {problem.tags.length > 3 && (
                        <Chip
                          label={`+${problem.tags.length - 3} more`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            borderColor: "primary.main",
                            color: "primary.main",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "flex-start", ml: 1 }}>
                    {problem.solved ? (
                      <CheckCircle
                        sx={{ color: "success.main", fontSize: 24 }}
                      />
                    ) : (
                      <RadioButtonUnchecked
                        sx={{ color: "text.secondary", fontSize: 24 }}
                      />
                    )}
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mt: 'auto' }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTime
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {problem.timeLimit}s
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Memory
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {problem.memoryLimit}MB
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mr: 1 }}
                      >
                        Points:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        {problem.points}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mr: 1 }}
                      >
                        Rating:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        {problem.rating}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Check if it's a contest problem (contains '-') or individual problem
                      if (problem.id.includes('-')) {
                        // Navigate to contest problem detail page
                        navigate(`/problems/${problem.id}`);
                      } else {
                        // Navigate to individual problem detail page
                        navigate(`/individual-problem/${problem.id}`);
                      }
                    }}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "secondary.main",
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                    }}
                  >
                    Solve
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {solvedProblemsCount}/{problems.length} solved ({problems.length > 0 ? Math.round((solvedProblemsCount / problems.length) * 100) : 0}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={problems.length > 0 ? (solvedProblemsCount / problems.length) * 100 : 0}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "background.paper",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "success.main",
              },
            }}
          />
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 600,
                },
                "& .Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "secondary.main",
                },
              }}
            />
          </Box>
        )}

        {/* No problems message */}
        {currentProblems.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ color: "text.secondary", mb: 2 }}>
              No problems found
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Try adjusting your filters or check back later for new problems.
            </Typography>
          </Box>
        )}

        {/* Add Problem Dialog */}
        <Dialog
          open={addProblemDialogOpen}
          onClose={handleCloseAddProblemDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Add New Problem
              </Typography>
              <IconButton onClick={handleCloseAddProblemDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Problem Title"
                  variant="outlined"
                  value={newProblem.title}
                  onChange={(e) => handleNewProblemChange('title', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Topic"
                  variant="outlined"
                  value={newProblem.topic}
                  onChange={(e) => handleNewProblemChange('topic', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={newProblem.difficulty}
                    label="Difficulty"
                    onChange={(e) => handleNewProblemChange('difficulty', e.target.value)}
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Points"
                  variant="outlined"
                  type="number"
                  value={newProblem.points}
                  onChange={(e) => handleNewProblemChange('points', parseInt(e.target.value) || 0)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Time Limit (seconds)"
                  variant="outlined"
                  type="number"
                  value={newProblem.timeLimit}
                  onChange={(e) => handleNewProblemChange('timeLimit', parseInt(e.target.value) || 1)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Memory Limit (MB)"
                  variant="outlined"
                  type="number"
                  value={newProblem.memoryLimit}
                  onChange={(e) => handleNewProblemChange('memoryLimit', parseInt(e.target.value) || 1)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={newProblem.description}
                  onChange={(e) => handleNewProblemChange('description', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Constraints"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={newProblem.constraints}
                  onChange={(e) => handleNewProblemChange('constraints', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Example 1 - Input"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={newProblem.example1.input}
                  onChange={(e) => handleNestedChange('example1', 'input', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Example 1 - Output"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={newProblem.example1.output}
                  onChange={(e) => handleNestedChange('example1', 'output', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Example 2 - Input"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={newProblem.example2.input}
                  onChange={(e) => handleNestedChange('example2', 'input', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Example 2 - Output"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={newProblem.example2.output}
                  onChange={(e) => handleNestedChange('example2', 'output', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddProblemDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleAddProblem}
              variant="contained"
              color="primary"
              disabled={!newProblem.title || !newProblem.topic || !newProblem.description}
            >
              Add Problem
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Problems;