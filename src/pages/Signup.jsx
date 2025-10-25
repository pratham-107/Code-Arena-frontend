import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Link,
  Checkbox,
  FormControlLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (!experience) {
      setError("Please select your experience level");
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API call
      const userData = {
        name,
        email,
        password,
        experience,
        agreeToTerms: agreeToTerms.toString(), // Backend expects string "true"
      };

      // Make API call
      const response = await authAPI.signup(userData);

      if (response.data.success) {
        // Store token and user data in sessionStorage
        sessionStorage.setItem("token", response.data.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.data.user));

        // Redirect to home page
        navigate("/");
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Signup failed. Please try again."
        );
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        alignItems: "center",
        backgroundColor: "background.default",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "background.paper",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1,
                color: "primary.main",
              }}
            >
              Create Account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 3,
              }}
            >
              Join our competitive programming community
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gridTemplateRows: "repeat(3, 1fr)",
                gap: 3,
                mb: 2,
              }}
            >
              {/* Name field - div1 */}
              <Box sx={{ gridArea: { xs: "1 / 1 / 2 / 2", sm: "1 / 1 / 2 / 2" } }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Email field - div2 */}
              <Box sx={{ gridArea: { xs: "2 / 1 / 3 / 2", sm: "1 / 2 / 2 / 3" } }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Password field - div3 */}
              <Box sx={{ gridArea: { xs: "3 / 1 / 4 / 2", sm: "2 / 1 / 3 / 2" } }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Confirm Password field - div4 */}
              <Box sx={{ gridArea: { xs: "4 / 1 / 5 / 2", sm: "2 / 2 / 3 / 3" } }}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Experience field - div5 */}
              <Box sx={{ gridArea: { xs: "5 / 1 / 6 / 2", sm: "3 / 1 / 4 / 2" } }}>
                <FormControl fullWidth>
                  <InputLabel>Programming Experience</InputLabel>
                  <Select
                    value={experience}
                    label="Programming Experience"
                    onChange={(e) => setExperience(e.target.value)}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Experience Level</em>
                    </MenuItem>
                    <MenuItem value="beginner">Beginner (0-1 years)</MenuItem>
                    <MenuItem value="intermediate">
                      Intermediate (1-3 years)
                    </MenuItem>
                    <MenuItem value="advanced">Advanced (3+ years)</MenuItem>
                    <MenuItem value="competitive">
                      Competitive Programmer
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{" "}
                      <Link href="#" sx={{ color: "primary.main" }}>
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" sx={{ color: "primary.main" }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    backgroundColor: "primary.main",
                    color: "secondary.main",
                    fontWeight: 700,
                    fontSize: "1.1rem",
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
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Already have an account?{" "}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleLoginRedirect}
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;