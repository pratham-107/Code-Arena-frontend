import React, { useState, useEffect } from "react";
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
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  AccessTime,
  Person,
  Visibility,
  Favorite,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  // Mock blog data
  const mockPosts = [
    {
      _id: "1",
      title: "Getting Started with Competitive Programming",
      content: "Learn the fundamentals of competitive programming and how to excel in coding contests. This comprehensive guide covers everything from basic algorithms to advanced data structures.",
      author: { name: "Alex Johnson" },
      category: "Beginner Guides",
      tags: ["Algorithms", "Tips", "Beginner"],
      views: 1250,
      likes: 42,
      createdAt: "2023-05-15",
    },
    {
      _id: "2",
      title: "Mastering Dynamic Programming",
      content: "Dynamic programming is a crucial skill for competitive programmers. In this article, we'll explore common DP patterns and how to recognize when to apply them.",
      author: { name: "Sarah Chen" },
      category: "Advanced Techniques",
      tags: ["DP", "Optimization", "Interviews"],
      views: 2100,
      likes: 87,
      createdAt: "2023-06-22",
    },
    {
      _id: "3",
      title: "Graph Algorithms Every Programmer Should Know",
      content: "Graph theory forms the basis for many challenging problems in competitive programming. This article covers essential graph algorithms and their applications.",
      author: { name: "Michael Rodriguez" },
      category: "Data Structures",
      tags: ["Graphs", "BFS", "DFS", "Dijkstra"],
      views: 1800,
      likes: 65,
      createdAt: "2023-07-10",
    },
    {
      _id: "4",
      title: "System Design for Coding Interviews",
      content: "Preparing for system design interviews can be challenging. This guide provides a structured approach to tackling system design problems in technical interviews.",
      author: { name: "Emma Wilson" },
      category: "Interview Preparation",
      tags: ["System Design", "Scalability", "Interviews"],
      views: 3200,
      likes: 120,
      createdAt: "2023-08-05",
    },
    {
      _id: "5",
      title: "Optimizing Code for Performance",
      content: "Writing efficient code is crucial in competitive programming. Learn techniques to optimize your solutions and avoid common performance pitfalls.",
      author: { name: "David Kim" },
      category: "Optimization",
      tags: ["Performance", "Big O", "Tips"],
      views: 1500,
      likes: 54,
      createdAt: "2023-08-18",
    },
    {
      _id: "6",
      title: "Mathematics in Competitive Programming",
      content: "Many competitive programming problems require a solid understanding of mathematics. This article covers essential mathematical concepts and their applications.",
      author: { name: "Olivia Davis" },
      category: "Mathematics",
      tags: ["Math", "Number Theory", "Combinatorics"],
      views: 980,
      likes: 38,
      createdAt: "2023-09-02",
    },
  ];

  const mockCategories = [
    { name: "All", posts: 6 },
    { name: "Beginner Guides", posts: 1 },
    { name: "Advanced Techniques", posts: 1 },
    { name: "Data Structures", posts: 1 },
    { name: "Interview Preparation", posts: 1 },
    { name: "Optimization", posts: 1 },
    { name: "Mathematics", posts: 1 },
  ];

  // Filter posts based on search term and category
  useEffect(() => {
    // Set categories
    setCategories(mockCategories);
    
    // Filter posts
    let filtered = mockPosts;
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (categoryFilter && categoryFilter !== "") {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }
    
    // Pagination
    const postsPerPage = 6;
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    setTotalPages(totalPages);
    
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = filtered.slice(startIndex, startIndex + postsPerPage);
    
    setPosts(currentPosts);
  }, [searchTerm, categoryFilter, currentPage]);

  // Handle post click
  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
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
            Blog
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Read the latest articles, tips, and insights from our community
          </Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4, p: 3, backgroundColor: "background.paper" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search Blog Posts"
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

            <Grid item xs={12} md={4}>
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
                  <MenuItem key={category.name} value={category.name === "All" ? "" : category.name} sx={{ padding: '8px 12px' }}>
                    {category.name} ({category.posts})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Card>

        {/* Blog Posts */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: '24px',
          mb: 4
        }}>
          {posts.map((post) => (
            <Card
              key={post._id}
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
              onClick={() => handlePostClick(post._id)}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Chip 
                    label={post.category} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      borderColor: "primary.main", 
                      color: "primary.main",
                      fontWeight: 600,
                      maxWidth: '70%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Visibility sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {post.views}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography
                  variant="h6"
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1, 
                    color: "primary.main",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minHeight: '3rem'
                  }}
                >
                  {post.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    minHeight: '4.5rem'
                  }}
                >
                  {post.content}
                </Typography>
                
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {post.tags && post.tags.slice(0, 3).map((tag, index) => (
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
                  {post.tags && post.tags.length > 3 && (
                    <Chip
                      label={`+${post.tags.length - 3}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderColor: "primary.main",
                        color: "primary.main",
                      }}
                    />
                  )}
                </Box>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                      {(post.author?.name || "U").charAt(0)}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {post.author?.name || "Unknown"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Favorite sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {post.likes}
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

        {/* No posts message */}
        {posts.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ color: "text.secondary", mb: 2 }}>
              No blog posts found
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
              Try adjusting your filters or check back later for new posts!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Blog;