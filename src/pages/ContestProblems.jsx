import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { contestAPI } from "../services/contestsAPI";
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
  Button,
} from "@mui/material";
import { PlayArrow } from "@mui/icons-material";

const ContestProblems = () => {
  const { id } = useParams(); // Contest ID
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContestProblems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch contest details and problems from our backend
        const response = await contestAPI.getContestById(id);

        if (response.data.success) {
          const contestData = response.data.data.contest;
          setContest(contestData);
          setProblems(contestData.problems || []);
        } else {
          throw new Error(response.data.message || "Failed to fetch contest problems");
        }
      } catch (err) {
        console.error("Error fetching contest problems:", err);
        setError(err.message || "Failed to load contest problems. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContestProblems();
    }
  }, [id]);

  const handleSolveProblem = (problem) => {
    // Navigate to the problem detail page
    // We'll use a combination of contest ID and problem ID to identify the problem
    const problemId = `${id}-${problem._id}`;
    navigate(`/problems/${problemId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
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
        py: 4,
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: "primary.main",
            }}
          >
            {contest?.title || "Contest Problems"}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 3,
            }}
          >
            {contest?.description || "Problems for this contest"}
          </Typography>
        </Box>

        {problems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ color: "text.secondary", mb: 2 }}>
              No problems available
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              There are no problems assigned to this contest yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {problems.map((problem, index) => (
              <Grid item xs={12} key={problem._id}>
                <Card 
                  sx={{ 
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: "primary.main",
                            }}
                          >
                            {String.fromCharCode(65 + index)}. {problem.title}
                          </Typography>
                          <Chip
                            label={problem.difficulty || "Medium"}
                            color={getDifficultyColor(problem.difficulty)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            mb: 2,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {problem.description?.substring(0, 200)}...
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 600,
                          }}
                        >
                          {problem.points || 100} points
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => handleSolveProblem(problem)}
                        sx={{
                          backgroundColor: "primary.main",
                          color: "secondary.main",
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          "&:hover": {
                            backgroundColor: "#333333",
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Solve Problem
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ContestProblems;