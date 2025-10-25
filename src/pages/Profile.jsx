import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Button,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Save,
  Cancel,
  Person,
  Code,
  EmojiEvents,
  Groups,
  School,
  CalendarToday,
  LocationOn,
  Link as LinkIcon,
  Email,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    joinDate: "",
    avatar: "",
  });
  const [stats, setStats] = useState({
    problemsSolved: 0,
    contestsParticipated: 0,
    rank: 0,
    reputation: 0,
  });
  const [achievements, setAchievements] = useState([]);
  const [editData, setEditData] = useState({ ...profileData });

  const navigate = useNavigate();

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfileData({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        username: "alexj",
        bio: "Competitive programmer passionate about algorithms and data structures. Always looking to learn new techniques and improve my skills.",
        location: "San Francisco, CA",
        website: "https://alexjohnson.dev",
        joinDate: "January 2023",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200",
      });
      
      setStats({
        problemsSolved: 127,
        contestsParticipated: 24,
        rank: 1542,
        reputation: 875,
      });
      
      setAchievements([
        { id: 1, title: "First Problem Solved", description: "Solved your first CodeArena problem", date: "Jan 15, 2023" },
        { id: 2, title: "Contest Winner", description: "Won 1st place in Weekly Challenge #5", date: "Mar 22, 2023" },
        { id: 3, title: "Streak Master", description: "Maintained a 30-day problem solving streak", date: "Jun 5, 2023" },
        { id: 4, title: "Community Helper", description: "Provided 50 helpful answers in community forums", date: "Aug 18, 2023" },
      ]);
      
      setEditData({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        username: "alexj",
        bio: "Competitive programmer passionate about algorithms and data structures. Always looking to learn new techniques and improve my skills.",
        location: "San Francisco, CA",
        website: "https://alexjohnson.dev",
      });
      
      setLoading(false);
    }, 800);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
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

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        py: 4,
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ backgroundColor: "background.paper", mb: 4 }}>
          <CardContent>
            {/* Profile Header */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mb: 4 }}>
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  src={profileData.avatar}
                  sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {profileData.name}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
                  @{profileData.username}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={handleSettings}
                  >
                    Settings
                  </Button>
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                {isEditing ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                    />
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={editData.username}
                      onChange={handleInputChange}
                    />
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      multiline
                      rows={3}
                      value={editData.bio}
                      onChange={handleInputChange}
                    />
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={editData.location}
                      onChange={handleInputChange}
                    />
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={editData.website}
                      onChange={handleInputChange}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
                      {profileData.bio}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOn sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {profileData.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinkIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography 
                          variant="body2" 
                          sx={{ color: "primary.main", textDecoration: "none" }}
                          component="a"
                          href={profileData.website}
                          target="_blank"
                        >
                          {profileData.website}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 18, color: "text.secondary" }} />
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Joined {profileData.joinDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Stats */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
                Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: "center", p: 2, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                    <Code sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.problemsSolved}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Problems Solved
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: "center", p: 2, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                    <EmojiEvents sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.contestsParticipated}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Contests
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: "center", p: 2, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                    <School sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      #{stats.rank}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Global Rank
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card sx={{ textAlign: "center", p: 2, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                    <Groups sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.reputation}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Reputation
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                mb: 3,
                "& .MuiTabs-indicator": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              <Tab label="Achievements" />
              <Tab label="Activity" />
              <Tab label="Settings" />
            </Tabs>

            <Divider sx={{ mb: 3 }} />

            {/* Tab Content */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
                  Achievements
                </Typography>
                <Grid container spacing={2}>
                  {achievements.map((achievement) => (
                    <Grid item xs={12} sm={6} key={achievement.id}>
                      <Card sx={{ p: 2, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              backgroundColor: "primary.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <EmojiEvents sx={{ color: "white" }} />
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {achievement.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                              {achievement.description}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              Earned on {achievement.date}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
                  Recent Activity
                </Typography>
                <Card sx={{ p: 3, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                  <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
                    No recent activity to display.
                  </Typography>
                </Card>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}>
                  Account Settings
                </Typography>
                <Card sx={{ p: 3, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                  <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
                    For detailed account settings, please visit the <Button onClick={handleSettings}>Settings page</Button>.
                  </Typography>
                </Card>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Profile;