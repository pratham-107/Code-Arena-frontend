import React, { useState, useEffect } from "react";
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
  Tabs,
  Tab,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  EmojiEvents,
  TrendingUp,
  Search as SearchIcon,
  School,
  WorkspacePremium,
} from "@mui/icons-material";
import { codeforcesAPIEndpoints } from "../services/codeforcesAPI";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContestId, setSelectedContestId] = useState(null);

  const usersPerPage = 10;

  // Fetch contest standings from Codeforces API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // For demo purposes, we'll use a fixed contest ID
        // In a real application, you would either:
        // 1. Let the user select a contest
        // 2. Use the most recent contest
        // 3. Use a specific contest based on context
        const contestId = 1234; // Example contest ID

        // Fetch contest standings from Codeforces
        const response = await codeforcesAPIEndpoints.getContestStandings(
          contestId
        );

        if (response.data.status === "OK") {
          // Transform Codeforces standings data to our format
          const transformedUsers = response.data.result.rows.map(
            (row, index) => ({
              id: row.party.members[0].handle,
              rank: row.rank,
              username: row.party.members[0].handle,
              name: row.party.members[0].handle,
              avatar: "",
              score: row.points,
              problemsSolved: Object.keys(row.problemResults).filter(
                (key) => row.problemResults[key].points > 0
              ).length,
              contestsParticipated: 1, // This is for a single contest
              country: "N/A", // Codeforces doesn't provide country in standings
              badge: getBadgeFromRank(row.rank),
            })
          );

          setUsers(transformedUsers);
        } else {
          throw new Error("Failed to fetch leaderboard from Codeforces");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Get badge based on rank
  const getBadgeFromRank = (rank) => {
    if (rank <= 10) return "Grandmaster";
    if (rank <= 50) return "Master";
    if (rank <= 100) return "Expert";
    if (rank <= 500) return "Specialist";
    if (rank <= 1000) return "Pupil";
    return "Newbie";
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    return (
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // Get badge color
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Grandmaster":
        return "#ff0000";
      case "Master":
        return "#ff6a00";
      case "Expert":
        return "#00bcd4";
      case "Specialist":
        return "#4caf50";
      case "Pupil":
        return "#9c27b0";
      case "Newbie":
        return "#795548";
      default:
        return "#9e9e9e";
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1);
  };

  // Handle user profile click
  const handleUserClick = (userId) => {
    console.log(`Viewing profile for user ${userId}`);
    // In a real implementation, this would navigate to the user's profile
    // or open it in a new tab
    window.open(`https://codeforces.com/profile/${userId}`, "_blank");
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setTimeFilter("all");
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
            Leaderboard
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            See how participants rank in Codeforces contests
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                p: 3,
                backgroundColor: "background.paper",
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <EmojiEvents
                sx={{ fontSize: 40, color: "warning.main", mb: 2 }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {users.length}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Participants
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                p: 3,
                backgroundColor: "background.paper",
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <TrendingUp sx={{ fontSize: 40, color: "success.main", mb: 2 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {users.reduce((sum, user) => sum + user.problemsSolved, 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Problems Solved
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                p: 3,
                backgroundColor: "background.paper",
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <WorkspacePremium
                sx={{ fontSize: 40, color: "secondary.main", mb: 2 }}
              />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                1
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Contest Shown
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card
              sx={{
                p: 3,
                backgroundColor: "background.paper",
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <School sx={{ fontSize: 40, color: "info.main", mb: 2 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                N/A
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Countries
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs for different leaderboard categories */}
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
            label="Overall Rankings"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="This Month"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
            disabled // Disabled since we're showing a single contest
          />
          <Tab
            label="This Week"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
            disabled // Disabled since we're showing a single contest
          />
          <Tab
            label="By Country"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
            disabled // Disabled since Codeforces doesn't provide country data in standings
          />
          <Tab
            label="By Institution"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
            disabled // Disabled since Codeforces doesn't provide institution data in standings
          />
        </Tabs>

        {/* Filters */}
        <Card sx={{ mb: 4, p: 3, backgroundColor: "background.paper" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Users"
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

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={timeFilter}
                  label="Time Period"
                  onChange={(e) => setTimeFilter(e.target.value)}
                  sx={{
                    borderRadius: 2,
                  }}
                  disabled // Disabled since we're showing a single contest
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={resetFilters}
                sx={{
                  backgroundColor: "primary.main",
                  color: "secondary.main",
                  fontWeight: 600,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#333333",
                  },
                }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Leaderboard Table */}
        <Card
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table sx={{ minWidth: 650 }} aria-label="leaderboard table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    Rank
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    User
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    Score
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    Problems
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    Contests
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    Badge
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handleUserClick(user.username)}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {user.rank <= 3 ? (
                          <EmojiEvents
                            sx={{
                              fontSize: 24,
                              mr: 1,
                              color:
                                user.rank === 1
                                  ? "#FFD700"
                                  : user.rank === 2
                                  ? "#C0C0C0"
                                  : "#CD7F32",
                            }}
                          />
                        ) : null}
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: user.rank <= 3 ? 700 : 500 }}
                        >
                          {user.rank}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            backgroundColor: "primary.main",
                            color: "secondary.main",
                          }}
                        >
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {user.username}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            {user.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "primary.main" }}
                      >
                        {user.score}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {user.problemsSolved}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {user.contestsParticipated}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.badge}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: getBadgeColor(user.badge),
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* User Badge Legend */}
        <Card sx={{ mt: 4, p: 3, backgroundColor: "background.paper" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}
          >
            User Badge Legend
          </Typography>
          <Grid container spacing={2}>
            {[
              "Grandmaster",
              "Master",
              "Expert",
              "Specialist",
              "Pupil",
              "Newbie",
            ].map((badge) => (
              <Grid item xs={6} sm={4} md={2} key={badge}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: getBadgeColor(badge),
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {badge}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>

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

        {/* No users message */}
        {currentUsers.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ color: "text.secondary", mb: 2 }}>
              No users found
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Try adjusting your search or check back later.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Leaderboard;
