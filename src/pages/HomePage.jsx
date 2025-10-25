import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Divider,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import SpeedIcon from "@mui/icons-material/Speed";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LanguageIcon from "@mui/icons-material/Language";
// Import coding language icons
import JavascriptIcon from "@mui/icons-material/Javascript";
import DataObjectIcon from "@mui/icons-material/DataObject";
import StorageIcon from "@mui/icons-material/Storage";
import HtmlIcon from "@mui/icons-material/Html";
import CssIcon from "@mui/icons-material/Css";
// Import marquee component
import Marquee from "react-fast-marquee";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      title: "Online Code Editor",
      description:
        "Write and compile code in multiple languages with our powerful online editor.",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
      title: "Compete & Challenge",
      description:
        "Participate in coding contests and challenge yourself with algorithmic problems.",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: "Community",
      description:
        "Connect with fellow programmers and share knowledge in our vibrant community.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: "Performance Tracking",
      description:
        "Track your progress and improve your coding skills with detailed analytics.",
    },
  ];

  const handleProblem = () => {
    navigate("/problems");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleStartCoding = () => {
    if (isAuthenticated()) {
      navigate("/editor");
    } else {
      navigate("/signup");
    }
  };

  const benefits = [
    "Access to 1000+ coding problems",
    "Real-time code compilation",
    "Performance analytics",
    "Community discussions",
    "Contest participation",
  ];

  // Define coding language icons for marquee
  const languageIcons = [
    <JavascriptIcon key="js" sx={{ fontSize: 40, color: "#000000", mx: 3 }} />,
    <DataObjectIcon key="py" sx={{ fontSize: 40, color: "#000000", mx: 3 }} />,
    <HtmlIcon key="html" sx={{ fontSize: 40, color: "#000000", mx: 3 }} />,
    <CssIcon key="css" sx={{ fontSize: 40, color: "#000000", mx: 3 }} />,
    <StorageIcon key="sql" sx={{ fontSize: 40, color: "#000000", mx: 3 }} />,
    <CodeIcon key="code" sx={{ fontSize: 40, color: "#000000", mx: 3 }} />,
    <LanguageIcon key="lang" sx={{ fontSize: 40, color: "#000000", mx: 3 }} />,
  ];

  return (
    <Box sx={{ backgroundColor: "background.default", width: "100%" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
          color: "secondary.main",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                }}
              >
                Master Coding With{" "}
                <span style={{ color: "#f5f5dc" }}>CodeArena</span>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: "#e8e8d0",
                  maxWidth: 500,
                }}
              >
                Practice, compete, and master algorithms with our competitive
                programming platform designed for developers.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
                <Button
                  onClick={handleStartCoding}
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#f5f5dc",
                    color: "#000000",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      backgroundColor: "#ffffff",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {isAuthenticated() ? "Continue Coding" : "Start Coding Now"}
                </Button>
                <Button
                  onClick={handleProblem}
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "#f5f5dc",
                    borderColor: "#f5f5dc",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    "&:hover": {
                      backgroundColor: "rgba(245, 245, 220, 0.1)",
                      borderColor: "#ffffff",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  View Problems
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRadius: 3,
                  p: 3,
                  minHeight: 350,
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(245, 245, 220, 0.2)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LanguageIcon sx={{ color: "#f5f5dc", mr: 1 }} />
                  <Typography
                    variant="h6"
                    sx={{ color: "#f5f5dc", fontWeight: 600 }}
                  >
                    Code Playground
                  </Typography>
                </Box>
                <pre
                  style={{
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    overflow: "auto",
                    color: "#f5f5dc",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                  }}
                >
                  {`function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (i === Math.floor(arr.length / 2)) continue;
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}`}
                </pre>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* First Marquee - Programming Languages */}
      <Box sx={{ py: 5, backgroundColor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#000000",
            }}
          >
            Supported Languages
          </Typography>
          <Marquee gradient={false} speed={50} pauseOnHover={true}>
            {[...languageIcons, ...languageIcons].map((icon, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                {icon}
              </Box>
            ))}
          </Marquee>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "#000000" }}
                >
                  50K+
                </Typography>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Active Users
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "#000000" }}
                >
                  1000+
                </Typography>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Coding Problems
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "#000000" }}
                >
                  500+
                </Typography>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Contests
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "#000000" }}
                >
                  50+
                </Typography>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  Programming Languages
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, backgroundColor: "#f8f8f0" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: "#000000",
              }}
            >
              Why Choose CodeArena?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#666666",
                maxWidth: 700,
                mx: "auto",
              }}
            >
              We provide everything you need to become a better programmer and
              compete at the highest levels.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: "#000000",
                      mb: 3,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 700, color: "#000000" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666666" }}>
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Second Marquee - Technologies */}
      <Box sx={{ py: 3, backgroundColor: "#000000" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#f5f5dc",
            }}
          >
            Built with Modern Technologies
          </Typography>
          <Marquee gradient={false} speed={40} pauseOnHover={true}>
            {[...languageIcons, ...languageIcons].map((icon, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                {React.cloneElement(icon, {
                  sx: { ...icon.props.sx, color: "#f5f5dc" },
                })}
              </Box>
            ))}
          </Marquee>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: 10, backgroundColor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  backgroundColor: "#000000",
                  borderRadius: 3,
                  p: 4,
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column",
                  color: "#f5f5dc",
                }}
              >
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                  Competitive Programming Environment
                </Typography>
                <pre
                  style={{
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    overflow: "auto",
                    color: "#f5f5dc",
                    fontSize: "0.9rem",
                  }}
                >
                  {`// Example: Two Sum Problem
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`}
                </pre>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 4,
                  color: "#000000",
                }}
              >
                Everything You Need To{" "}
                <span style={{ color: "#000000" }}>Excel</span>
              </Typography>

              <Box sx={{ mb: 4 }}>
                {benefits.map((benefit, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <CheckCircleIcon sx={{ color: "#000000", mr: 2 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {!isAuthenticated() ? (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    onClick={handleSignup}
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#000000",
                      color: "#f5f5dc",
                      px: 5,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: 3,
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                      "&:hover": {
                        backgroundColor: "#333333",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Sign Up Free
                  </Button>
                  <Button
                    onClick={handleLogin}
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "#000000",
                      borderColor: "#000000",
                      px: 5,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: 3,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        borderColor: "#333333",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Login
                  </Button>
                </Box>
              ) : (
                <Button
                  onClick={() => navigate("/problems")}
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#000000",
                    color: "#f5f5dc",
                    px: 5,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    "&:hover": {
                      backgroundColor: "#333333",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Start Solving Problems
                </Button>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 10, backgroundColor: "#000000", color: "#f5f5dc" }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              mb: 3,
              fontWeight: 800,
            }}
          >
            Ready to Level Up Your Coding?
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 6,
              maxWidth: 700,
              mx: "auto",
              color: "#e8e8d0",
            }}
          >
            Join thousands of developers practicing and competing on our
            platform today.
          </Typography>
          {!isAuthenticated() ? (
            <Button
              onClick={handleSignup}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#f5f5dc",
                color: "#000000",
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(245, 245, 220, 0.3)",
                "&:hover": {
                  backgroundColor: "#ffffff",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(245, 245, 220, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Create Free Account
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/contests")}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#f5f5dc",
                color: "#000000",
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(245, 245, 220, 0.3)",
                "&:hover": {
                  backgroundColor: "#ffffff",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(245, 245, 220, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              View Upcoming Contests
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
