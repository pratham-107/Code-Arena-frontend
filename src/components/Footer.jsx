import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleContests = () => {
    navigate("/contests");
  };

  const handleProblems = () => {
    navigate("/problems");
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

  const handleCommunity = () => {
    navigate("/community");
  };

  const handleTutorials = () => {
    navigate("/tutorials");
  };

  const handleBlog = () => {
    navigate("/blog");
  };

  const handleDocumentation = () => {
    navigate("/documentation");
  };

  const handleSupport = () => {
    navigate("/support");
  };

  return (
    <Box
      sx={{
        py: 6,
        backgroundColor: "#000000",
        color: "secondary.main",
        borderTop: "1px solid rgba(245, 245, 220, 0.1)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
            >
              <CodeIcon sx={{ color: "secondary.main", fontSize: 32 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "secondary.main" }}
              >
                CodeArena
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "#e8e8d0", mb: 3, maxWidth: 300 }}
            >
              The ultimate platform for competitive programming enthusiasts to
              practice, compete, and improve.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                sx={{
                  color: "secondary.main",
                  backgroundColor: "rgba(245, 245, 220, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(245, 245, 220, 0.2)",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "secondary.main",
                  backgroundColor: "rgba(245, 245, 220, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(245, 245, 220, 0.2)",
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "secondary.main",
                  backgroundColor: "rgba(245, 245, 220, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(245, 245, 220, 0.2)",
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "secondary.main",
                  backgroundColor: "rgba(245, 245, 220, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(245, 245, 220, 0.2)",
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 700, color: "secondary.main" }}
            >
              Platform
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                onClick={handleProblems}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Problems
              </Button>
              <Button
                onClick={handleContests}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Contests
              </Button>
              <Button
                onClick={handleLeaderboard}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Leaderboard
              </Button>
              <Button
                onClick={handleCommunity}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Community
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 700, color: "secondary.main" }}
            >
              Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                onClick={handleTutorials}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Tutorials
              </Button>
              <Button
                onClick={handleBlog}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Blog
              </Button>
              <Button
                onClick={handleDocumentation}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Documentation
              </Button>
              <Button
                onClick={handleSupport}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Support
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 700, color: "secondary.main" }}
            >
              Account
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button
                onClick={handleLogin}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Login
              </Button>
              <Button
                onClick={handleSignup}
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Sign Up
              </Button>
              <Button
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Profile
              </Button>
              <Button
                sx={{
                  color: "#e8e8d0",
                  justifyContent: "flex-start",
                  p: 0,
                  fontWeight: 500,
                  "&:hover": {
                    color: "secondary.main",
                  },
                }}
              >
                Settings
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 700, color: "secondary.main" }}
            >
              Newsletter
            </Typography>
            <Typography variant="body1" sx={{ color: "#e8e8d0", mb: 2 }}>
              Subscribe to our newsletter for updates and new challenges.
            </Typography>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                maxWidth: 400,
              }}
            >
              <Box
                component="input"
                type="email"
                placeholder="Your email"
                sx={{
                  flex: 1,
                  p: 1.5,
                  borderRadius: 1,
                  border: "1px solid rgba(245, 245, 220, 0.3)",
                  backgroundColor: "rgba(245, 245, 220, 0.1)",
                  color: "secondary.main",
                  "&:focus": {
                    outline: "none",
                    borderColor: "secondary.main",
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "secondary.main",
                  color: "primary.main",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#e8e8d0",
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: "1px solid rgba(245, 245, 220, 0.1)",
            mt: 6,
            pt: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#aaa" }}>
            © {new Date().getFullYear()} CodeArena. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;