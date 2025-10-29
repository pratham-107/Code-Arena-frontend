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
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CalendarToday,
  AccessTime,
  Groups,
  EmojiEvents,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { contestAPI } from "../services/contestsAPI"; // Replace Codeforces import

const Contest = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [registeredOnly, setRegisteredOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const contestsPerPage = 10;

  // Fetch contests from our backend API
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch contests from our backend
        const response = await contestAPI.getAllContests();

        if (response.data.success) {
          // Transform contest data to match our format
          const transformedContests = response.data.data.contests
            .map((contest) => {
              // Store the original date values for status calculation
              const originalStartDate = contest.startDate;
              const originalStartTime = contest.startTime;

              return {
                id: contest._id,
                name: contest.title,
                description: contest.description,
                startDate: originalStartDate, // Keep original for status calculation
                startTime: originalStartTime, // Keep original for status calculation
                displayStartTime: new Date(contest.startDate).toLocaleDateString() + " " + contest.startTime,
                duration: contest.duration,
                type: contest.difficulty,
                status: getContestStatus(contest.startDate, contest.startTime, contest.duration),
                websiteUrl: `/contest/${contest._id}`,
              };
            })
            // Sort by relative time (upcoming first)
            .sort((a, b) => {
              // Simple sorting by start time
              const dateA = new Date(`${a.startDate}T${a.startTime}`);
              const dateB = new Date(`${b.startDate}T${b.startTime}`);
              return dateA - dateB;
            });

          setContests(transformedContests);
        } else {
          throw new Error("Failed to fetch contests from backend");
        }
      } catch (err) {
        console.error("Error fetching contests:", err);
        setError("Failed to load contests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  // Helper function to determine contest status
  const getContestStatus = (startDate, startTime, duration) => {
    try {
      // Handle different date formats
      let contestStart;

      // If startDate is already a Date object, use it directly
      if (startDate instanceof Date) {
        contestStart = new Date(startDate);
      }
      // If startDate is a string, parse it
      else if (typeof startDate === 'string') {
        // Try to parse as ISO date first
        if (startDate.includes('T')) {
          contestStart = new Date(startDate);
        } else {
          // Assume it's in YYYY-MM-DD format
          contestStart = new Date(`${startDate}T${startTime}`);
        }
      }
      // If it's a date object in string form, parse it
      else {
        contestStart = new Date(startDate);
      }

      // If the date is invalid, return "Unknown"
      if (isNaN(contestStart.getTime())) {
        return "Unknown";
      }

      const contestEnd = new Date(contestStart.getTime() + duration * 60000);
      const now = new Date();

      if (now < contestStart) {
        return "Upcoming";
      } else if (now >= contestStart && now <= contestEnd) {
        return "Running";
      } else {
        return "Finished";
      }
    } catch (error) {
      console.error("Error calculating contest status:", error);
      return "Unknown";
    }
  };

  // Filter contests based on search and filters
  const filteredContests = contests.filter((contest) => {
    const matchesSearch =
      contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "" || contest.difficulty === difficultyFilter;
    const matchesStatus =
      statusFilter === "" ||
      contest.status.toLowerCase() === statusFilter.toLowerCase();
    // For now, we don't track registration status, so this filter is disabled
    const matchesRegistration = !registeredOnly; // Always true since we don't track registration

    return (
      matchesSearch && matchesDifficulty && matchesStatus && matchesRegistration
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredContests.length / contestsPerPage);
  const startIndex = (currentPage - 1) * contestsPerPage;
  const currentContests = filteredContests.slice(
    startIndex,
    startIndex + contestsPerPage
  );

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "primary";
      case "running":
        return "success";
      case "finished":
        return "default";
      case "unknown":
        return "default";
      default:
        return "default";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "Upcoming";
      case "running":
        return "Ongoing";
      case "finished":
        return "Ended";
      case "unknown":
        return "Unknown";
      default:
        return status;
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1);

    // Set status filter based on tab
    switch (newValue) {
      case 1:
        setStatusFilter("Upcoming");
        break;
      case 2:
        setStatusFilter("Running");
        break;
      case 3:
        setStatusFilter("Finished");
        break;
      default:
        setStatusFilter("");
    }
  };

  // Handle create contest
  const handleCreateContest = () => {
    navigate("/create-contest");
  };

  // Handle registration
  const handleRegister = (contest) => {
    console.log(`Registering for contest ${contest.id}`);
    navigate("/contest-registration", { state: { contest } });
  };

  // Handle participate
  const handleParticipate = (contest) => {
    console.log(`Participating in contest ${contest.id}`);
    // Navigate directly to contest problems page
    navigate(`/contest/${contest.id}/problems`);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setDifficultyFilter("");
    setStatusFilter("");
    setRegisteredOnly(false);
    setCurrentPage(1);
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
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: "primary.main",
            }}
          >
            Coding Contests
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Participate in competitive programming contests from Codeforces
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateContest}
              sx={{
                backgroundColor: "primary.main",
                color: "secondary.main",
                fontWeight: 700,
                px: 4,
                py: 1.5,
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
              Create Contest Arena
            </Button>
          </Box>
        </Box>

        {/* Tabs for different contest categories */}
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
            label="All Contests"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="Upcoming"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="Ongoing"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="Finished"
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Contests"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
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
                  disabled // Disabled since Codeforces doesn't categorize contests by difficulty
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
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
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
                        pl: 3,
                        pr: 3,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="Upcoming">Upcoming</MenuItem>
                  <MenuItem value="Running">Ongoing</MenuItem>
                  <MenuItem value="Finished">Ended</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={registeredOnly}
                      onChange={(e) => setRegisteredOnly(e.target.checked)}
                      color="primary"
                      disabled // Disabled since we don't track registration status
                    />
                  }
                  label="Show registered only"
                />
                <Button onClick={resetFilters} size="small">
                  Reset Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Contest Listings */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' },
          gap: '24px',
          mb: 4
        }}>
          {currentContests.map((contest) => (
            <Card
              key={contest.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                },
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: "primary.main",
                        minHeight: "3rem", // Ensure consistent height for title
                      }}
                    >
                      {contest.name}
                    </Typography>
                    <Chip
                      label={getStatusText(contest.status)}
                      color={getStatusColor(contest.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Chip
                    label={contest.type}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderColor: "primary.main",
                      color: "primary.main",
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                    flexGrow: 1, // Allow description to take available space
                    minHeight: "3rem", // Ensure consistent height for description
                  }}
                >
                  {contest.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <CalendarToday
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {contest.displayStartTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTime
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {contest.duration} minutes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Groups
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {contest.type} Contest
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <EmojiEvents
                        sx={{ fontSize: 18, mr: 1, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Codeforces
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: "auto", // Push buttons to the bottom
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <RadioButtonUnchecked
                      sx={{ color: "text.secondary", mr: 1 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Registration via Codeforces
                    </Typography>
                  </Box>

                  <Box>
                    <Button
                      variant="contained"
                      onClick={() => handleParticipate(contest)}
                      sx={{
                        backgroundColor: "primary.main",
                        color: "secondary.main",
                        fontWeight: 600,
                        px: 2,
                        py: 0.5,
                        "&:hover": {
                          backgroundColor: "#333333",
                        },
                      }}
                    >
                      View Contest
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
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

        {/* No contests message */}
        {currentContests.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ color: "text.secondary", mb: 2 }}>
              No contests found
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Try adjusting your filters or check back later for new contests.
            </Typography>
          </Box>
        )}

        {/* Confirmation Dialog */}
      </Container>
    </Box>
  );
};

export default Contest;
