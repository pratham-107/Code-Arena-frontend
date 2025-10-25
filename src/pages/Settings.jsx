import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  Alert,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Save,
  Notifications,
  Security,
  Palette,
  Language,
  Visibility,
  VisibilityOff,
  Person,
} from "@mui/icons-material";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    username: "alexj",
    bio: "Competitive programmer passionate about algorithms and data structures.",
    
    // Security Settings
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    
    // Notification Settings
    emailNotifications: true,
    contestReminders: true,
    communityNotifications: false,
    newsletter: true,
    
    // Preferences
    theme: "light",
    language: "en",
    timezone: "UTC-05:00",
  });

  const handleSave = () => {
    // In a real application, you would send this data to your backend
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sections = [
    { id: "profile", title: "Profile", icon: <Person /> },
    { id: "security", title: "Security", icon: <Security /> },
    { id: "notifications", title: "Notifications", icon: <Notifications /> },
    { id: "preferences", title: "Preferences", icon: <Palette /> },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        py: 4,
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: "primary.main",
            }}
          >
            Settings
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Manage your account settings and preferences
          </Typography>
        </Box>

        {/* Horizontal Navigation */}
        <Card sx={{ mb: 4, backgroundColor: "background.paper" }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: "primary.main",
              }}
            >
              Settings
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {sections.map((section) => (
                <Chip
                  key={section.id}
                  label={section.title}
                  icon={section.icon}
                  onClick={() => setActiveSection(section.id)}
                  sx={{ 
                    cursor: 'pointer',
                    m: 0.5,
                    backgroundColor: activeSection === section.id ? "primary.main" : "rgba(0, 0, 0, 0.04)",
                    color: activeSection === section.id ? "primary.contrastText" : "text.primary",
                    '&:hover': {
                      backgroundColor: activeSection === section.id ? "primary.dark" : "rgba(0, 0, 0, 0.08)"
                    }
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: "background.paper" }}>
              <CardContent>
                {/* Profile Settings */}
                {activeSection === "profile" && (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Person /> Profile Settings
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          value={settings.name}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          value={settings.username}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={settings.email}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          name="bio"
                          multiline
                          rows={4}
                          value={settings.bio}
                          onChange={handleInputChange}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Security Settings */}
                {activeSection === "security" && (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Security /> Security Settings
                    </Typography>
                    
                    <Alert severity="info" sx={{ mb: 3 }}>
                      It's a good practice to change your password regularly for security.
                    </Alert>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={settings.currentPassword}
                          onChange={handleInputChange}
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
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          name="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={settings.newPassword}
                          onChange={handleInputChange}
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
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={settings.confirmPassword}
                          onChange={handleInputChange}
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
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button variant="contained" sx={{ py: 1.5, px: 4 }}>
                          Change Password
                        </Button>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 4 }} />
                    
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </Typography>
                      <Button variant="outlined">Enable 2FA</Button>
                    </Box>
                  </Box>
                )}

                {/* Notification Settings */}
                {activeSection === "notifications" && (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Notifications /> Notification Settings
                    </Typography>
                    
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={handleInputChange}
                            name="emailNotifications"
                          />
                        }
                        label="Email Notifications"
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.contestReminders}
                            onChange={handleInputChange}
                            name="contestReminders"
                          />
                        }
                        label="Contest Reminders"
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.communityNotifications}
                            onChange={handleInputChange}
                            name="communityNotifications"
                          />
                        }
                        label="Community Notifications"
                      />
                      
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.newsletter}
                            onChange={handleInputChange}
                            name="newsletter"
                          />
                        }
                        label="Newsletter Subscription"
                      />
                    </Box>
                  </Box>
                )}

                {/* Preferences */}
                {activeSection === "preferences" && (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Palette /> Preferences
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Theme</InputLabel>
                          <Select
                            name="theme"
                            value={settings.theme}
                            onChange={handleSelectChange}
                          >
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="dark">Dark</MenuItem>
                            <MenuItem value="auto">Auto</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Language</InputLabel>
                          <Select
                            name="language"
                            value={settings.language}
                            onChange={handleSelectChange}
                          >
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="es">Spanish</MenuItem>
                            <MenuItem value="fr">French</MenuItem>
                            <MenuItem value="de">German</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Timezone</InputLabel>
                          <Select
                            name="timezone"
                            value={settings.timezone}
                            onChange={handleSelectChange}
                          >
                            <MenuItem value="UTC-12:00">UTC-12:00</MenuItem>
                            <MenuItem value="UTC-11:00">UTC-11:00</MenuItem>
                            <MenuItem value="UTC-10:00">UTC-10:00</MenuItem>
                            <MenuItem value="UTC-09:00">UTC-09:00</MenuItem>
                            <MenuItem value="UTC-08:00">UTC-08:00</MenuItem>
                            <MenuItem value="UTC-07:00">UTC-07:00</MenuItem>
                            <MenuItem value="UTC-06:00">UTC-06:00</MenuItem>
                            <MenuItem value="UTC-05:00">UTC-05:00</MenuItem>
                            <MenuItem value="UTC-04:00">UTC-04:00</MenuItem>
                            <MenuItem value="UTC-03:00">UTC-03:00</MenuItem>
                            <MenuItem value="UTC-02:00">UTC-02:00</MenuItem>
                            <MenuItem value="UTC-01:00">UTC-01:00</MenuItem>
                            <MenuItem value="UTC+00:00">UTC+00:00</MenuItem>
                            <MenuItem value="UTC+01:00">UTC+01:00</MenuItem>
                            <MenuItem value="UTC+02:00">UTC+02:00</MenuItem>
                            <MenuItem value="UTC+03:00">UTC+03:00</MenuItem>
                            <MenuItem value="UTC+04:00">UTC+04:00</MenuItem>
                            <MenuItem value="UTC+05:00">UTC+05:00</MenuItem>
                            <MenuItem value="UTC+06:00">UTC+06:00</MenuItem>
                            <MenuItem value="UTC+07:00">UTC+07:00</MenuItem>
                            <MenuItem value="UTC+08:00">UTC+08:00</MenuItem>
                            <MenuItem value="UTC+09:00">UTC+09:00</MenuItem>
                            <MenuItem value="UTC+10:00">UTC+10:00</MenuItem>
                            <MenuItem value="UTC+11:00">UTC+11:00</MenuItem>
                            <MenuItem value="UTC+12:00">UTC+12:00</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <Divider sx={{ my: 4 }} />
                
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Settings;