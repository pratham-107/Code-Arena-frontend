import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { contestAPI } from "../services/contestsAPI";
import { solutionsAPI } from "../services/solutionsAPI";
import { getCurrentUser } from "../services/auth";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import {
  AccessTime,
  Memory,
  PlayArrow,
  Lightbulb,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import CodeEditor from "../components/CodeEditor";

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parse contestId and problemId from the combined id
        const [contestId, problemId] = id.split('-');

        if (!contestId || !problemId) {
          throw new Error("Invalid problem ID");
        }

        // Fetch problem from our backend
        const response = await contestAPI.getProblemById(contestId, problemId);

        if (response.data.success) {
          const problemData = response.data.data.problem;

          setProblem({
            id: problemData.id,
            title: problemData.title,
            description: problemData.description,
            difficulty: problemData.difficulty,
            tags: [problemData.topic],
            points: problemData.points,
            timeLimit: problemData.timeLimit,
            memoryLimit: problemData.memoryLimit,
            examples: [
              problemData.example1 ? {
                input: problemData.example1.input,
                output: problemData.example1.output
              } : null,
              problemData.example2 ? {
                input: problemData.example2.input,
                output: problemData.example2.output
              } : null
            ].filter(example => example !== null),
            constraints: problemData.constraints || "",
          });
        } else {
          throw new Error(response.data.message || "Failed to fetch problem");
        }
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError(err.message || "Failed to load problem. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Check if problem is solved
    const checkIfSolved = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser && id) {
          const response = await solutionsAPI.getSolution(currentUser.id, id);
          if (response.data.success) {
            setIsSolved(response.data.data.solution.isSolved || false);
          }
        }
      } catch (err) {
        // If solution doesn't exist, that's fine
        setIsSolved(false);
      }
    };

    if (id) {
      fetchProblem();
      checkIfSolved();
    }
  }, [id]);

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
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Container maxWidth="xl">
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "primary.main",
              }}
            >
              {problem.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isSolved ? (
                <>
                  <CheckCircle sx={{ color: "success.main", fontSize: 24 }} />
                  <Typography variant="h6" sx={{ color: "success.main", fontWeight: 600 }}>
                    Solved
                  </Typography>
                </>
              ) : (
                <>
                  <RadioButtonUnchecked sx={{ color: "text.secondary", fontSize: 24 }} />
                  <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 600 }}>
                    Not Solved
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
            <Chip
              label={problem.difficulty}
              color={getDifficultyColor(problem.difficulty)}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {problem.points} points
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {problem.tags.join(", ")}
            </Typography>
          </Box>
        </Box>

        {/* Grid layout for problem statement and code editor */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'repeat(2, 1fr)',
            gridRowGap: '24px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}
        >
          {/* Problem Statement - div1 */}
          <Box sx={{ gridRow: '1 / 2' }}>
            <Card sx={{ backgroundColor: "background.paper" }}>
              <Tabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                sx={{
                  mb: 0,
                  "& .MuiTabs-indicator": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                <Tab
                  label="Problem Statement"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    "&.Mui-selected": {
                      color: "primary.main",
                    },
                  }}
                />
                <Tab
                  label="Hints"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    "&.Mui-selected": {
                      color: "primary.main",
                    },
                  }}
                />
              </Tabs>

              <Divider />

              <CardContent>
                {activeTab === 0 && (
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        mb: 3,
                        whiteSpace: "pre-line"
                      }}
                    >
                      {problem.description}
                    </Typography>

                    {problem.constraints && (
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}
                        >
                          Constraints
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.secondary",
                            whiteSpace: "pre-line"
                          }}
                        >
                          {problem.constraints}
                        </Typography>
                      </Box>
                    )}

                    {problem.examples.map((example, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}
                        >
                          Example {index + 1}
                        </Typography>
                        <Paper sx={{ p: 2, mb: 1, backgroundColor: "#f5f5f5" }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                          >
                            Input
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              whiteSpace: "pre-wrap",
                              mb: 2
                            }}
                          >
                            {example.input}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                          >
                            Output
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              whiteSpace: "pre-wrap"
                            }}
                          >
                            {example.output}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AccessTime
                            sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Time Limit: {problem.timeLimit}s
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
                            Memory Limit: {problem.memoryLimit}MB
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        mb: 3
                      }}
                    >
                      Hints and tips for solving this problem will be displayed here.
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary"
                      }}
                    >
                      <Lightbulb sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }} />
                      Try to break down the problem into smaller subproblems.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Code Editor - div2 */}
          <Box sx={{ gridRow: '2 / 3' }}>
            <Card sx={{ backgroundColor: "background.paper" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}
                >
                  Code Editor
                </Typography>
                <CodeEditor problemId={problem.id} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProblemDetail;