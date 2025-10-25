import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  AccessTime,
  Person,
  Code,
  School,
} from "@mui/icons-material";

const Tutorials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Mock tutorial data
  const tutorials = [
    {
      id: 1,
      title: "Introduction to Dynamic Programming",
      description: "Learn the fundamentals of dynamic programming with step-by-step examples and practice problems.",
      author: "Alex Johnson",
      duration: "45 min",
      difficulty: "Beginner",
      category: "Algorithms",
      image: "https://images.unsplash.com/photo-1555066931-43269d4ea98c?auto=format&fit=crop&w=600&h=400",
      tags: ["DP", "Recursion", "Memoization"],
    },
    {
      id: 2,
      title: "Graph Algorithms: BFS and DFS",
      description: "Master breadth-first search and depth-first search algorithms with visual explanations.",
      author: "Sarah Chen",
      duration: "60 min",
      difficulty: "Intermediate",
      category: "Data Structures",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&h=400",
      tags: ["Graphs", "BFS", "DFS"],
    },
    {
      id: 3,
      title: "Advanced Tree Traversal Techniques",
      description: "Explore advanced tree traversal methods including Morris traversal and threaded binary trees.",
      author: "Michael Rodriguez",
      duration: "75 min",
      difficulty: "Advanced",
      category: "Data Structures",
      image: "https://images.unsplash.com/photo-1555066932-43269d4ea98c?auto=format&fit=crop&w=600&h=400",
      tags: ["Trees", "Traversal", "Binary Trees"],
    },
    {
      id: 4,
      title: "String Matching Algorithms",
      description: "Learn KMP, Rabin-Karp, and other efficient string matching algorithms for competitive programming.",
      author: "Emma Wilson",
      duration: "50 min",
      difficulty: "Intermediate",
      category: "Algorithms",
      image: "https://images.unsplash.com/photo-1555066933-43269d4ea98d?auto=format&fit=crop&w=600&h=400",
      tags: ["Strings", "KMP", "Rabin-Karp"],
    },
    {
      id: 5,
      title: "Segment Trees and Lazy Propagation",
      description: "Deep dive into segment trees and lazy propagation for efficient range queries and updates.",
      author: "David Kim",
      duration: "90 min",
      difficulty: "Advanced",
      category: "Data Structures",
      image: "https://images.unsplash.com/photo-1555066934-43269d4ea98e?auto=format&fit=crop&w=600&h=400",
      tags: ["Segment Trees", "Lazy Propagation", "Range Queries"],
    },
    {
      id: 6,
      title: "Bit Manipulation Techniques",
      description: "Master bit manipulation tricks commonly used in competitive programming and technical interviews.",
      author: "Olivia Davis",
      duration: "40 min",
      difficulty: "Beginner",
      category: "Bit Manipulation",
      image: "https://images.unsplash.com/photo-1555066935-43269d4ea98f?auto=format&fit=crop&w=600&h=400",
      tags: ["Bitwise", "XOR", "Bitmasking"],
    },
  ];

  const categories = ["All", "Algorithms", "Data Structures", "Bit Manipulation", "Mathematics", "Graph Theory"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  // Filter tutorials based on search term, category, and difficulty
  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch = 
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      categoryFilter === "" || categoryFilter === "All" || tutorial.category === categoryFilter;
    
    const matchesDifficulty = 
      difficultyFilter === "" || difficultyFilter === "All" || tutorial.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Pagination
  const tutorialsPerPage = 4;
  const totalPages = Math.ceil(filteredTutorials.length / tutorialsPerPage);
  const startIndex = (currentPage - 1) * tutorialsPerPage;
  const currentTutorials = filteredTutorials.slice(startIndex, startIndex + tutorialsPerPage);

  // Handle tutorial click
  const handleTutorialClick = (tutorialId) => {
    console.log(`Viewing tutorial ${tutorialId}`);
    // Navigation logic would go here
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
            Tutorials
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Learn competitive programming concepts with our comprehensive tutorials and guides
          </Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4, p: 3, backgroundColor: "background.paper" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Tutorials"
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

            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                select
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    padding: "0 35px",
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category} sx={{ padding: '8px 12px' }}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                select
                label="Difficulty"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    padding: "0px 50px",
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                      },
                    },
                  },
                }}
              >
                {difficulties.map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty} sx={{ padding: '8px 12px' }}>
                    {difficulty}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Card>

        {/* Tutorial Cards */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: '24px',
          mb: 4
        }}>
          {currentTutorials.map((tutorial) => (
            <Card
              key={tutorial.id}
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleTutorialClick(tutorial.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={tutorial.image}
                alt={tutorial.title}
              />
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Chip 
                    label={tutorial.difficulty} 
                    size="small" 
                    color={
                      tutorial.difficulty === "Beginner" ? "success" : 
                      tutorial.difficulty === "Intermediate" ? "warning" : "error"
                    }
                  />
                  <Chip 
                    label={tutorial.category} 
                    size="small" 
                    variant="outlined"
                    sx={{ borderColor: "primary.main", color: "primary.main" }}
                  />
                </Box>
                
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}
                >
                  {tutorial.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tutorial.description}
                </Typography>
                
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {tutorial.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderColor: "primary.main",
                        color: "primary.main",
                      }}
                    />
                  ))}
                </Box>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {tutorial.author}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {tutorial.duration}
                    </Typography>
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

        {/* No tutorials message */}
        {currentTutorials.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ color: "text.secondary", mb: 2 }}>
              No tutorials found
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
              Try adjusting your filters or check back later for new tutorials!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Tutorials;