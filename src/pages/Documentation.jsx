import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  MenuBook,
  Code,
  EmojiEvents,
  Groups,
  School,
  HelpOutline,
} from "@mui/icons-material";

const Documentation = () => {
  const [openSections, setOpenSections] = useState({
    gettingStarted: true,
    problems: false,
    contests: false,
    community: false,
    faq: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Documentation data
  const documentationData = {
    gettingStarted: {
      title: "Getting Started",
      icon: <MenuBook />,
      content: [
        {
          subtitle: "Account Setup",
          description: "To get started with CodeArena, you'll need to create an account. Click on the 'Sign Up' button in the top right corner and fill in your details. After verifying your email, you can log in to your account."
        },
        {
          subtitle: "Navigating the Platform",
          description: "The main navigation bar at the top of the page provides access to all major sections: Problems, Contests, Leaderboard, Community, Tutorials, and Blog. The footer contains additional resources and links."
        },
        {
          subtitle: "Profile Configuration",
          description: "After logging in, visit your profile page to customize your settings, update your avatar, and track your progress. You can also connect your Codeforces account to sync your problem-solving history."
        }
      ]
    },
    problems: {
      title: "Problems",
      icon: <Code />,
      content: [
        {
          subtitle: "Problem Sets",
          description: "Browse through thousands of coding problems from Codeforces, categorized by difficulty (Easy, Medium, Hard) and topic (Algorithms, Data Structures, Math, etc.). Use the search and filter options to find specific problems."
        },
        {
          subtitle: "Solving Problems",
          description: "Click on any problem to view its details. You can read the problem statement, constraints, and examples. Use our integrated code editor to write and test your solution. Submit your code to see if it passes all test cases."
        },
        {
          subtitle: "Solution Tracking",
          description: "Solved problems are marked with a checkmark in the problem list. You can review your previous submissions and track your progress over time in your profile."
        }
      ]
    },
    contests: {
      title: "Contests",
      icon: <EmojiEvents />,
      content: [
        {
          subtitle: "Participating in Contests",
          description: "Join upcoming contests or practice with past contests. Each contest has a specific start time and duration. Register for contests in advance to participate."
        },
        {
          subtitle: "Contest Rules",
          description: "Contests follow standard competitive programming rules. Problems are ranked by difficulty and point value. Your ranking is determined by the number of problems solved and the time taken."
        },
        {
          subtitle: "Virtual Participation",
          description: "Missed a contest? Participate in virtual contests to experience the same problems under the same time constraints. Your performance in virtual contests is tracked separately."
        }
      ]
    },
    community: {
      title: "Community",
      icon: <Groups />,
      content: [
        {
          subtitle: "Discussion Forums",
          description: "Engage with other programmers in our community forums. Share solutions, ask questions, and discuss problems with fellow coders. Create new posts to start discussions on specific topics."
        },
        {
          subtitle: "Tutorials and Blog",
          description: "Learn from community-contributed tutorials and blog posts. Share your own knowledge by writing tutorials to help others improve their skills."
        },
        {
          subtitle: "Leaderboard",
          description: "Track your progress and compete with others on our leaderboard. Rankings are based on the number of problems solved and contest performance."
        }
      ]
    },
    faq: {
      title: "FAQ",
      icon: <HelpOutline />,
      content: [
        {
          subtitle: "How do I reset my password?",
          description: "Click on the 'Login' button and then select 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox."
        },
        {
          subtitle: "Can I use my own code editor?",
          description: "Currently, we only support our integrated code editor for submissions. However, you can write code locally and paste it into our editor for submission."
        },
        {
          subtitle: "How are problems rated?",
          description: "Problems are rated based on their difficulty and the performance of users who have solved them. The rating system helps you find problems that match your skill level."
        },
        {
          subtitle: "What programming languages are supported?",
          description: "We support all major programming languages including C++, Java, Python, JavaScript, and more. Check the code editor for the complete list of available languages."
        }
      ]
    }
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
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: "primary.main",
            }}
          >
            Documentation
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Everything you need to know about using CodeArena
          </Typography>
        </Box>

        {/* Horizontal Table of Contents */}
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
              Table of Contents
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(documentationData).map(([key, section]) => (
                <Chip
                  key={key}
                  label={section.title}
                  icon={section.icon}
                  onClick={() => {
                    document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{ 
                    cursor: 'pointer',
                    m: 0.5,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {Object.entries(documentationData).map(([key, section]) => (
                <Card 
                  key={key} 
                  id={key}
                  sx={{ 
                    backgroundColor: "background.paper",
                    scrollMarginTop: 100
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box sx={{ mr: 2, color: "primary.main" }}>
                        {section.icon}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                        }}
                      >
                        {section.title}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {section.content.map((item, index) => (
                        <Box key={index}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              color: "text.primary",
                            }}
                          >
                            {item.subtitle}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "text.secondary",
                              lineHeight: 1.7,
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Documentation;