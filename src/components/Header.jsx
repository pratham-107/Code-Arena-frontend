import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser, logout } from "../services/auth";

const Header = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleHome = () => {
    navigate("/");
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

  const handleEditor = () => {
    navigate("/editor");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
        py: 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CodeIcon sx={{ color: "secondary.main", fontSize: 32 }} />
          <Typography
            onClick={handleHome}
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "secondary.main",
              letterSpacing: -0.5,
              cursor: "pointer",
            }}
          >
            CodeArena
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 4,
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleHome}
            sx={{
              color: "secondary.main",
              fontWeight: 600,
              fontSize: "1rem",
              position: "relative",
              "&:hover": {
                color: "#ffffff",
              },
            }}
          >
            Home
            <Box
              sx={{
                position: "absolute",
                bottom: -5,
                left: 0,
                right: 0,
                height: 3,
                backgroundColor: "#f5f5dc",
                borderRadius: 3,
                display: "none",
              }}
            />
          </Button>
          <Button
            onClick={handleProblems}
            sx={{
              color: "secondary.main",
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": {
                color: "#ffffff",
              },
            }}
          >
            Problems
          </Button>
          <Button
            onClick={handleContests}
            sx={{
              color: "secondary.main",
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": {
                color: "#ffffff",
              },
            }}
          >
            Contests
          </Button>
          <Button
            onClick={handleLeaderboard}
            sx={{
              color: "secondary.main",
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": {
                color: "#ffffff",
              },
            }}
          >
            Leaderboard
          </Button>
          <Button
            onClick={handleCommunity}
            sx={{
              color: "secondary.main",
              fontWeight: 600,
              fontSize: "1rem",
              "&:hover": {
                color: "#ffffff",
              },
            }}
          >
            Community
          </Button>
          {isAuthenticated() && (
            <>
              <Button
                onClick={handleEditor}
                sx={{
                  color: "secondary.main",
                  fontWeight: 600,
                  fontSize: "1rem",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                Editor
              </Button>
              <Button
                onClick={handleProfile}
                sx={{
                  color: "secondary.main",
                  fontWeight: 600,
                  fontSize: "1rem",
                  "&:hover": {
                    color: "#ffffff",
                  },
                }}
              >
                Profile
              </Button>
            </>
          )}
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 2,
            alignItems: "center",
          }}
        >
          {isAuthenticated() ? (
            <>
              <Typography sx={{ color: "secondary.main", fontWeight: 600 }}>
                Hi, {user?.name || "User"}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  color: "secondary.main",
                  borderColor: "secondary.main",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(245, 245, 220, 0.1)",
                    borderColor: "#ffffff",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  color: "secondary.main",
                  borderColor: "secondary.main",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(245, 245, 220, 0.1)",
                    borderColor: "#ffffff",
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={handleSignup}
                sx={{
                  backgroundColor: "secondary.main",
                  color: "primary.main",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  "&:hover": {
                    backgroundColor: "#e8e8d0",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* Mobile menu button */}
        <IconButton
          sx={{
            display: { xs: "flex", md: "none" },
            color: "secondary.main",
            p: 1,
          }}
        >
          <MenuIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;