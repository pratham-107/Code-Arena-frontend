import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  ArrowBack,
  ArrowForward,
  CalendarToday,
  AccessTime,
  CheckCircle,
} from "@mui/icons-material";
import { contestAPI } from "../services/contestsAPI";
import { getCurrentUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

const CreateContest = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [contestTitle, setContestTitle] = useState("");
  const [contestDescription, setContestDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(""); // Changed from 90 to ""
  const [difficulty, setDifficulty] = useState("Medium");
  const [problems, setProblems] = useState([]);
  const [openProblemDialog, setOpenProblemDialog] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // New problem form state
  const [problemTitle, setProblemTitle] = useState("");
  const [problemTopic, setProblemTopic] = useState("");
  const [problemDifficulty, setProblemDifficulty] = useState("Easy");
  const [problemDescription, setProblemDescription] = useState("");
  const [example1, setExample1] = useState({ input: "", output: "" });
  const [example2, setExample2] = useState({ input: "", output: "" });
  const [constraints, setConstraints] = useState("");
  const [problemPoints, setProblemPoints] = useState(""); // Changed from 100 to ""
  const [timeLimit, setTimeLimit] = useState(""); // Changed from 2 to ""
  const [memoryLimit, setMemoryLimit] = useState(""); // Changed from 256 to ""

  // Edit problem state
  const [editingProblemIndex, setEditingProblemIndex] = useState(-1);

  const steps = ["Contest Details", "Add Problems", "Review & Create"];

  const difficulties = ["Easy", "Medium", "Hard"];

  // Handle next step
  const handleNext = () => {
    if (
      activeStep === 0 &&
      (!contestTitle || !contestDescription || !startDate || !startTime || !duration)
    ) {
      alert("Please fill in all required contest details");
      return;
    }

    if (activeStep === 1 && problems.length === 0) {
      alert("Please add at least one problem to the contest");
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Add or update problem
  const handleSaveProblem = () => {
    if (!problemTitle || !problemTopic || !problemDescription) {
      alert("Please fill in all required problem fields");
      return;
    }

    const newProblem = {
      id: Date.now(),
      title: problemTitle,
      topic: problemTopic,
      difficulty: problemDifficulty,
      description: problemDescription,
      example1,
      example2,
      constraints,
      points: problemPoints === "" ? 100 : parseInt(problemPoints) || 100,
      timeLimit: timeLimit === "" ? 2 : parseInt(timeLimit) || 2,
      memoryLimit: memoryLimit === "" ? 256 : parseInt(memoryLimit) || 256,
    };

    if (editingProblemIndex >= 0) {
      // Update existing problem
      const updatedProblems = [...problems];
      updatedProblems[editingProblemIndex] = newProblem;
      setProblems(updatedProblems);
      setEditingProblemIndex(-1);
    } else {
      // Add new problem
      setProblems([...problems, newProblem]);
    }

    // Reset form
    setProblemTitle("");
    setProblemTopic("");
    setProblemDifficulty("Easy");
    setProblemDescription("");
    setExample1({ input: "", output: "" });
    setExample2({ input: "", output: "" });
    setConstraints("");
    setProblemPoints(""); // Changed from 100 to ""
    setTimeLimit(""); // Changed from 2 to ""
    setMemoryLimit(""); // Changed from 256 to ""
    setOpenProblemDialog(false);
  };

  // Edit problem
  const handleEditProblem = (index) => {
    const problem = problems[index];
    setProblemTitle(problem.title);
    setProblemTopic(problem.topic || "");
    setProblemDifficulty(problem.difficulty);
    setProblemDescription(problem.description);
    setExample1(problem.example1 || { input: "", output: "" });
    setExample2(problem.example2 || { input: "", output: "" });
    setConstraints(problem.constraints || "");
    setProblemPoints(problem.points === 100 ? "" : problem.points); // Show empty string for default value
    setTimeLimit(problem.timeLimit === 2 ? "" : problem.timeLimit); // Show empty string for default value
    setMemoryLimit(problem.memoryLimit === 256 ? "" : problem.memoryLimit); // Show empty string for default value
    setEditingProblemIndex(index);
    setOpenProblemDialog(true);
  };

  // Delete problem
  const handleDeleteProblem = (index) => {
    const updatedProblems = [...problems];
    updatedProblems.splice(index, 1);
    setProblems(updatedProblems);
  };

  // Open problem dialog for new problem
  const handleAddProblem = () => {
    setEditingProblemIndex(-1);
    setProblemTitle("");
    setProblemTopic("");
    setProblemDifficulty("Easy");
    setProblemDescription("");
    setExample1({ input: "", output: "" });
    setExample2({ input: "", output: "" });
    setConstraints("");
    setProblemPoints(""); // Changed from 100 to ""
    setTimeLimit(""); // Changed from 2 to ""
    setMemoryLimit(""); // Changed from 256 to ""
    setOpenProblemDialog(true);
  };

  // Create contest
  const handleCreateContest = async () => {
    try {
      const user = getCurrentUser();

      if (!user) {
        showError("You must be logged in to create a contest");
        return;
      }

      // Validate that we have at least one problem
      if (!problems || problems.length === 0) {
        showError("Please add at least one problem to the contest");
        return;
      }

      // Validate each problem has required fields
      for (let i = 0; i < problems.length; i++) {
        const problem = problems[i];
        if (!problem.title || !problem.topic || !problem.description) {
          showError(`Problem ${i + 1} is missing required fields (title, topic, or description)`);
          return;
        }
      }

      // Format the contest data
      // Note: createdBy is now handled by the backend using the authenticated user
      const contestData = {
        title: contestTitle.trim(),
        description: contestDescription.trim(),
        startDate: startDate,
        startTime: startTime,
        duration: duration === "" ? 90 : parseInt(duration) || 90, // Use 90 as default if empty or invalid
        difficulty: difficulty,
        problems: problems.map(problem => ({
          title: problem.title?.trim() || "",
          topic: problem.topic?.trim() || "",
          difficulty: problem.difficulty || "Easy",
          description: problem.description?.trim() || "",
          example1: problem.example1 || { input: "", output: "" },
          example2: problem.example2 || { input: "", output: "" },
          constraints: problem.constraints?.trim() || "",
          points: parseInt(problem.points) || 100,
          timeLimit: parseInt(problem.timeLimit) || 2,
          memoryLimit: parseInt(problem.memoryLimit) || 256
        })),
      };

      console.log("Creating contest with formatted data:", JSON.stringify(contestData, null, 2));

      // Call the backend API to create the contest
      const response = await contestAPI.createContest(contestData);

      if (response.data.success) {
        // Show success modal instead of alert
        setSuccessOpen(true);
      } else {
        console.error("Backend error response:", response.data);
        showError("Failed to create contest: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating contest:", error);
      if (error.response && error.response.data) {
        console.error("Detailed error response:", error.response.data);
        showError("Error creating contest: " + error.response.data.message);
      } else {
        showError("An error occurred while creating the contest. Please try again.");
      }
    }
  };

  // Handle success modal close and reset form
  const handleSuccessClose = () => {
    setSuccessOpen(false);
    // Reset form
    setActiveStep(0);
    setContestTitle("");
    setContestDescription("");
    setStartDate("");
    setStartTime("");
    setDuration(""); // Changed from 90 to ""
    setDifficulty("Medium");
    setProblems([]);
    // Navigate to contests page
    navigate("/contests");
  };

  // Handle success modal close and create another
  const handleCreateAnother = () => {
    setSuccessOpen(false);
    // Reset form but stay on the same page
    setActiveStep(0);
    setContestTitle("");
    setContestDescription("");
    setStartDate("");
    setStartTime("");
    setDuration(""); // Changed from 90 to ""
    setDifficulty("Medium");
    setProblems([]);
  };

  // Handle error snackbar
  const showError = (message) => {
    setErrorMessage(message);
    setErrorOpen(true);
  };

  // Handle error snackbar close
  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: "primary.main",
            }}
          >
            Create Contest
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Set up a new programming contest and add problems for participants
          </Typography>
        </Box>

        <Card
          sx={{ p: 3, backgroundColor: "background.paper", borderRadius: 3 }}
        >
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 4 }} />

          {activeStep === 0 && (
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 3, color: "primary.main" }}
              >
                Contest Details
              </Typography>

              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridTemplateRows: 'repeat(5, 1fr)',
                gap: '8px'
              }}>
                <Box sx={{ gridColumn: 'span 2 / span 2' }}>
                  <TextField
                    fullWidth
                    label="Contest Title"
                    variant="outlined"
                    value={contestTitle}
                    onChange={(e) => setContestTitle(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ gridColumn: 'span 2 / span 2' }}>
                  <TextField
                    fullWidth
                    label="Duration (minutes)"
                    type="number"
                    variant="outlined"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ gridColumn: 'span 2 / span 2' }}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ gridColumn: 'span 2 / span 2' }}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    variant="outlined"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ gridColumn: 'span 1 / span 1' }}>
                  <FormControl fullWidth>
                    <InputLabel>Contest Difficulty</InputLabel>
                    <Select
                      value={difficulty}
                      label="Contest Difficulty"
                      onChange={(e) => setDifficulty(e.target.value)}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {difficulties.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{
                  gridColumn: 'span 5 / span 5',
                  gridRow: 'span 2 / span 2'
                }}>
                  <TextField
                    fullWidth
                    label="Contest Description"
                    variant="outlined"
                    multiline
                    rows={5}
                    value={contestDescription}
                    onChange={(e) => setContestDescription(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  Contest Problems
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddProblem}
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
                  Add Problem
                </Button>
              </Box>

              {problems.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "text.secondary", mb: 2 }}
                  >
                    No problems added yet
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 3 }}
                  >
                    Click "Add Problem" to start adding problems to your contest
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddProblem}
                    sx={{
                      color: "primary.main",
                      borderColor: "primary.main",
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                    }}
                  >
                    Add Your First Problem
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {problems.map((problem, index) => (
                    <Grid item xs={12} key={problem.id}>
                      <Paper sx={{ p: 3, position: "relative" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 700, color: "primary.main" }}
                            >
                              {problem.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary", mt: 1 }}
                            >
                              Topic: {problem.topic}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                              <Chip
                                label={problem.difficulty}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor:
                                    problem.difficulty === "Easy"
                                      ? "success.light"
                                      : problem.difficulty === "Medium"
                                        ? "warning.light"
                                        : "error.light",
                                }}
                              />
                              <Chip
                                label={`${problem.points} pts`}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                              <Chip
                                label={`${problem.timeLimit}s TL`}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                              <Chip
                                label={`${problem.memoryLimit}MB ML`}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>
                          </Box>
                          <Box>
                            <IconButton
                              onClick={() => handleEditProblem(index)}
                              sx={{ color: "primary.main" }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteProblem(index)}
                              sx={{ color: "error.main" }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", mb: 2 }}
                        >
                          {problem.description}
                        </Typography>
                        {problem.example1.input && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Example 1:
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Input:</strong> {problem.example1.input}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Output:</strong> {problem.example1.output}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                        {problem.example2.input && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Example 2:
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Input:</strong> {problem.example2.input}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body2">
                                  <strong>Output:</strong> {problem.example2.output}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        )}
                        {problem.constraints && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Constraints:
                            </Typography>
                            <Typography variant="body2">
                              {problem.constraints}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 3, color: "primary.main" }}
              >
                Review Contest
              </Typography>

              <Card sx={{ mb: 3, p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}
                >
                  Contest Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Title:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, color: "text.secondary" }}
                    >
                      {contestTitle}
                    </Typography>

                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Description:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2, color: "text.secondary" }}
                    >
                      {contestDescription}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Start Date & Time:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CalendarToday
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                      >
                        {formatDate(startDate)} at {startTime}
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Duration:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AccessTime
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary" }}
                      >
                        {duration} minutes
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      Difficulty:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      {difficulty}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              <Card sx={{ mb: 3, p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}
                >
                  Problems ({problems.length})
                </Typography>

                <Grid container spacing={2}>
                  {problems.map((problem, index) => (
                    <Grid item xs={12} md={6} key={problem.id}>
                      <Paper sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            {index + 1}. {problem.title}
                          </Typography>
                          <Chip
                            label={`${problem.points} pts`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", mb: 1 }}
                        >
                          Topic: {problem.topic}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                          <Chip
                            label={problem.difficulty}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor:
                                problem.difficulty === "Easy"
                                  ? "success.light"
                                  : problem.difficulty === "Medium"
                                    ? "warning.light"
                                    : "error.light",
                            }}
                          />
                          <Chip
                            label={`${problem.timeLimit}s`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                          <Chip
                            label={`${problem.memoryLimit}MB`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            mb: 1
                          }}
                        >
                          {problem.description}
                        </Typography>
                        {problem.example1.input && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Example 1:
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              <strong>Input:</strong> {problem.example1.input}
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              <strong>Output:</strong> {problem.example1.output}
                            </Typography>
                          </Box>
                        )}
                        {problem.example2.input && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Example 2:
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              <strong>Input:</strong> {problem.example2.input}
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              <strong>Output:</strong> {problem.example2.output}
                            </Typography>
                          </Box>
                        )}
                        {problem.constraints && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              Constraints:
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {problem.constraints}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{
                color: "primary.main",
                fontWeight: 600,
                px: 3,
                py: 1,
              }}
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleCreateContest}
                sx={{
                  backgroundColor: "primary.main",
                  color: "secondary.main",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#333333",
                  },
                }}
              >
                Create Contest
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: "primary.main",
                  color: "secondary.main",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#333333",
                  },
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Card>
      </Container>

      {/* Problem Dialog */}
      <Dialog
        open={openProblemDialog}
        onClose={() => setOpenProblemDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProblemIndex >= 0 ? "Edit Problem" : "Add New Problem"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Problem Name"
                  variant="outlined"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Topic"
                  variant="outlined"
                  value={problemTopic}
                  onChange={(e) => setProblemTopic(e.target.value)}
                  required
                  helperText="Enter the topic this problem is from (e.g., Arrays, Dynamic Programming, Graphs)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Problem Level</InputLabel>
                  <Select
                    value={problemDifficulty}
                    label="Problem Level"
                    onChange={(e) => setProblemDifficulty(e.target.value)}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Problem Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  required
                  helperText="Provide a detailed explanation of the problem"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  Example 1
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Input"
                      variant="outlined"
                      multiline
                      rows={3}
                      value={example1.input}
                      onChange={(e) => setExample1({ ...example1, input: e.target.value })}
                      helperText="Enter the input for this example"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Output"
                      variant="outlined"
                      multiline
                      rows={3}
                      value={example1.output}
                      onChange={(e) => setExample1({ ...example1, output: e.target.value })}
                      helperText="Enter the expected output for this example"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  Example 2
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Input"
                      variant="outlined"
                      multiline
                      rows={3}
                      value={example2.input}
                      onChange={(e) => setExample2({ ...example2, input: e.target.value })}
                      helperText="Enter the input for this example"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Output"
                      variant="outlined"
                      multiline
                      rows={3}
                      value={example2.output}
                      onChange={(e) => setExample2({ ...example2, output: e.target.value })}
                      helperText="Enter the expected output for this example"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Constraints"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  helperText="Enter any constraints for the problem (optional)"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  Additional Settings
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Points"
                  type="number"
                  variant="outlined"
                  value={problemPoints}
                  onChange={(e) => setProblemPoints(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Time Limit (seconds)"
                  type="number"
                  variant="outlined"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Memory Limit (MB)"
                  type="number"
                  variant="outlined"
                  value={memoryLimit}
                  onChange={(e) => setMemoryLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenProblemDialog(false)}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProblem}
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              color: "secondary.main",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
          >
            {editingProblemIndex >= 0 ? "Update Problem" : "Add Problem"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        open={successOpen}
        onClose={handleSuccessClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "success.main" }}>
            Contest Created Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Box sx={{ mb: 2 }}>
              <CheckCircle sx={{ fontSize: 60, color: "success.main" }} />
            </Box>
            <DialogContentText>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your contest "{contestTitle}" has been created successfully.
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                You can now view it in the contests section or create another contest.
              </Typography>
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleSuccessClose}
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              color: "secondary.main",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
          >
            View Contests
          </Button>
          <Button
            onClick={handleCreateAnother}
            variant="outlined"
            sx={{
              color: "primary.main",
              borderColor: "primary.main",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Create Another
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateContest;
