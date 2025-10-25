import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Divider,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  Forum,
  TrendingUp,
  People,
  Search as SearchIcon,
  Add as AddIcon,
  ThumbUp,
  Comment,
  Share,
  Bookmark,
  Close as CloseIcon,
} from "@mui/icons-material";
import { communityAPI } from "../services/communityAPI";

const Community = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    onlineMembers: 0,
    totalPosts: 0,
    totalTopics: 0,
  });
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Comment related state
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  const postsPerPage = 5;

  // Fetch community data on component mount
  useEffect(() => {
    fetchCommunityData();
  }, []);

  // Fetch community data
  const fetchCommunityData = async () => {
    setLoading(true);
    try {
      // Fetch real statistics
      const statsResponse = await communityAPI.getStats();
      setStats(statsResponse.data);

      // Fetch real categories
      const categoriesResponse = await communityAPI.getCategories();
      setCategories(categoriesResponse.data);

      // Fetch posts
      await fetchPosts();
    } catch (error) {
      console.error("Error fetching community data:", error);
      showSnackbar("Error fetching community data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const params = {
        page: currentPage,
        limit: postsPerPage,
        category: categoryFilter || undefined,
        search: searchTerm || undefined,
      };

      const response = await communityAPI.getPosts(params);
      setPosts(response.data.posts || []);
      setTotalPages(response.data.totalPages || 0);

      // Update stats with actual post count
      setStats(prev => ({
        ...prev,
        totalPosts: response.data.total || prev.totalPosts
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      showSnackbar("Error fetching posts", "error");
    }
  };

  // Filter posts based on search term and category
  useEffect(() => {
    fetchPosts();
  }, [currentPage, categoryFilter, searchTerm]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1);
  };

  // Handle post click (now handles comments)
  const handlePostClick = (postId) => {
    // This function is now handled by the card's onClick which calls handleFetchComments
    console.log(`Viewing post ${postId}`);
  };

  // Handle opening new post dialog
  const handleOpenNewPostDialog = () => {
    setNewPostDialogOpen(true);
  };

  // Handle closing new post dialog
  const handleCloseNewPostDialog = () => {
    setNewPostDialogOpen(false);
    // Reset form
    setNewPost({
      title: "",
      content: "",
      category: "",
      tags: [],
    });
    setTagInput("");
  };

  // Handle input changes for new post form
  const handleNewPostChange = (field, value) => {
    setNewPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Handle fetching comments for a post
  const handleFetchComments = async (postId) => {
    if (comments[postId]) {
      // If comments are already loaded, just toggle visibility
      setExpandedPostId(expandedPostId === postId ? null : postId);
      return;
    }

    setLoadingComments(prev => ({ ...prev, [postId]: true }));
    try {
      const response = await communityAPI.getComments(postId);
      setComments(prev => ({ ...prev, [postId]: response.data }));
      setExpandedPostId(postId);
    } catch (error) {
      console.error("Error fetching comments:", error);
      showSnackbar("Error fetching comments", "error");
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle comment input change
  const handleCommentInputChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  // Handle adding a comment
  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content || !content.trim()) {
      showSnackbar("Please enter a comment", "error");
      return;
    }

    try {
      const response = await communityAPI.addComment(postId, { content });

      // Update comments state
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }));

      // Clear input
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));

      // Update post comment count
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? { ...post, comments: [...(post.comments || []), response.data._id] }
          : post
      ));

      showSnackbar("Comment added successfully!", "success");
    } catch (error) {
      console.error("Error adding comment:", error);
      showSnackbar("Error adding comment: " + (error.response?.data?.message || error.message), "error");
    }
  };

  // Handle creating a new post
  const handleCreatePost = async () => {
    // Validation
    if (!newPost.title.trim()) {
      showSnackbar("Please enter a title for your post", "error");
      return;
    }

    if (!newPost.content.trim()) {
      showSnackbar("Please enter content for your post", "error");
      return;
    }

    if (!newPost.category) {
      showSnackbar("Please select a category for your post", "error");
      return;
    }

    try {
      // Prepare post data (without author, as it will be extracted from the JWT token)
      const postData = {
        ...newPost
      };

      const response = await communityAPI.createPost(postData);
      console.log("Created post:", response.data);

      // Refresh posts
      await fetchPosts();

      // Close dialog and reset form
      handleCloseNewPostDialog();

      // Show success message
      showSnackbar("Post created successfully!", "success");
    } catch (error) {
      console.error("Error creating post:", error);
      showSnackbar("Error creating post: " + (error.response?.data?.message || error.message), "error");
    }
  };

  // Handle liking a post
  const handleLikePost = async (postId) => {
    try {
      const response = await communityAPI.likePost(postId);

      // Update posts state with new like count
      setPosts(prev => prev.map(post =>
        post._id === postId
          ? { ...post, likes: response.data.likes }
          : post
      ));

      showSnackbar("Post liked!", "success");
    } catch (error) {
      console.error("Error liking post:", error);
      showSnackbar("Error liking post: " + (error.response?.data?.message || error.message), "error");
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
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: "primary.main",
            }}
          >
            Community
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Connect with fellow programmers, share knowledge, and discuss
            competitive programming topics
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                p: 3,
                backgroundColor: "background.paper",
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <People sx={{ fontSize: 40, color: "primary.main", mb: 2 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {stats.totalMembers.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Members
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
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
                {stats.onlineMembers}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Online
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                p: 3,
                backgroundColor: "background.paper",
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <Forum sx={{ fontSize: 40, color: "secondary.main", mb: 2 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {stats.totalPosts.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Posts
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                p: 3,
                backgroundColor: "background.paper",
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <Bookmark sx={{ fontSize: 40, color: "info.main", mb: 2 }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {stats.totalTopics}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Topics
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs for different community sections */}
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
            label="All Discussions"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="Popular"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="Recent"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="Unanswered"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
          <Tab
            label="My Posts"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        </Tabs>

        {/* Filters and New Post Button */}
        <Card sx={{ mb: 4, p: 3, backgroundColor: "background.paper" }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Discussions"
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
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    padding: "0 35px",
                  }}
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                fullWidth
                onClick={handleOpenNewPostDialog}
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
                New Post
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Category Tags */}
        <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.name} (${category.posts})`}
              onClick={() => setCategoryFilter(category.name)}
              sx={{
                fontWeight: 600,
                backgroundColor:
                  categoryFilter === category.name
                    ? "primary.main"
                    : "background.paper",
                color:
                  categoryFilter === category.name
                    ? "secondary.main"
                    : "text.primary",
                border: categoryFilter === category.name ? "none" : "1px solid",
                borderColor: "divider",
                "&:hover": {
                  backgroundColor:
                    categoryFilter === category.name
                      ? "primary.main"
                      : "rgba(0, 0, 0, 0.04)",
                },
              }}
            />
          ))}
        </Box>

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Discussion Posts */}
        {!loading && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
            mb: 4
          }}>
            {posts.map((post) => (
              <Card
                key={post._id || post.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: "primary.main",
                            color: "secondary.main",
                            fontSize: "0.8rem",
                          }}
                        >
                          {((post.author?.name || post.author?.username || "U")?.toString() || "U").charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {post.author?.name || post.author?.username || "Unknown User"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown date"}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}
                      >
                        {post.title}
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
                        {post.content}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        <Chip
                          label={post.category}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            borderColor: "primary.main",
                            color: "primary.main",
                          }}
                        />
                        {post.tags && post.tags.map((tag, index) => (
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
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikePost(post._id || post.id);
                        }}
                      >
                        <ThumbUp
                          sx={{
                            fontSize: 18,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {post.likes || 0}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFetchComments(post._id || post.id);
                        }}
                      >
                        <Comment
                          sx={{
                            fontSize: 18,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {post.comments?.length || 0}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // View functionality would go here
                          console.log("View clicked");
                        }}
                      >
                        <VisibilityIcon
                          sx={{
                            fontSize: 18,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {post.views || 0}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton>
                      <Share sx={{ color: "text.secondary" }} />
                    </IconButton>
                  </Box>
                </CardContent>

                {/* Comments section - outside of CardContent to prevent click interference */}
                <Collapse in={expandedPostId === (post._id || post.id)} timeout="auto" unmountOnExit>
                  <Box sx={{ px: 3, pb: 2 }}>
                    {/* Comment input */}
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Add a comment..."
                        value={commentInputs[post._id || post.id] || ""}
                        onChange={(e) => handleCommentInputChange(post._id || post.id, e.target.value)}
                        variant="outlined"
                        size="small"
                        onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with input
                      />
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddComment(post._id || post.id);
                        }}
                        disabled={!commentInputs[post._id || post.id]?.trim()}
                      >
                        Post
                      </Button>
                    </Box>

                    {/* Comments list */}
                    {loadingComments[post._id || post.id] ? (
                      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : (
                      <List>
                        {(comments[post._id || post.id] || []).map((comment) => (
                          <ListItem
                            key={comment._id}
                            sx={{
                              flexDirection: "column",
                              alignItems: "flex-start",
                              borderBottom: "1px solid #eee",
                              pb: 2,
                              mb: 2,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 1 }}>
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    backgroundColor: "primary.main",
                                    color: "secondary.main",
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {((comment.author?.name || comment.author?.username || "U")?.toString() || "U").charAt(0)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={comment.author?.name || comment.author?.username || "Unknown User"}
                                secondary={new Date(comment.createdAt).toLocaleString()}
                                primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                                secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ pl: 4 }}>
                              {comment.content}
                            </Typography>
                          </ListItem>
                        ))}
                        {(comments[post._id || post.id] || []).length === 0 && (
                          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary", py: 2 }}>
                            No comments yet. Be the first to comment!
                          </Typography>
                        )}
                      </List>
                    )}
                  </Box>
                </Collapse>
              </Card>
            ))}
          </Box>
        )}

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
        {!loading && posts.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" sx={{ color: "text.secondary", mb: 2 }}>
              No discussions found
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
              Try adjusting your filters or be the first to start a discussion!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenNewPostDialog}
              sx={{
                backgroundColor: "primary.main",
                color: "secondary.main",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#333333",
                },
              }}
            >
              Create New Post
            </Button>
          </Box>
        )}

        {/* New Post Dialog */}
        <Dialog
          open={newPostDialogOpen}
          onClose={handleCloseNewPostDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Create New Post
              </Typography>
              <IconButton onClick={handleCloseNewPostDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'repeat(4, 1fr)',
              gap: '24px',
              mt: 1
            }}>
              {/* Post Title - div1 { grid-area: 1 / 1 / 2 / 3; } */}
              <Box sx={{ gridArea: '1 / 1 / 2 / 3' }}>
                <TextField
                  fullWidth
                  label="Post Title"
                  variant="outlined"
                  value={newPost.title}
                  onChange={(e) => handleNewPostChange('title', e.target.value)}
                />
              </Box>

              {/* Category Dropdown - div2 { grid-area: 2 / 1 / 3 / 3; } */}
              <Box sx={{ gridArea: '2 / 1 / 3 / 3' }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newPost.category}
                    label="Category"
                    onChange={(e) => handleNewPostChange('category', e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Add Tags - div3 { grid-area: 3 / 1 / 4 / 3; } */}
              <Box sx={{ gridArea: '3 / 1 / 4 / 3' }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                  <TextField
                    fullWidth
                    label="Add Tags"
                    variant="outlined"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddTag}
                    sx={{
                      height: "56px",
                      backgroundColor: "primary.main",
                      color: "secondary.main",
                      fontWeight: 600,
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              {/* Post Content - div4 { grid-area: 1 / 3 / 4 / 7; } */}
              <Box sx={{ gridArea: '1 / 3 / 5 / 7' }}>
                <TextField
                  fullWidth
                  label="Post Content"
                  variant="outlined"
                  multiline
                  rows={6}
                  value={newPost.content}
                  onChange={(e) => handleNewPostChange('content', e.target.value)}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseNewPostDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              variant="contained"
              color="primary"
              disabled={!newPost.title.trim() || !newPost.content.trim() || !newPost.category}
            >
              Create Post
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        {snackbar.open && (
          <Alert
            severity={snackbar.severity}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 9999,
            }}
            onClose={handleCloseSnackbar}
          >
            {snackbar.message}
          </Alert>
        )}
      </Container>
    </Box>
  );
};

// Add missing import for VisibilityIcon
const VisibilityIcon = ({ sx }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    style={{ width: 18, height: 18, marginRight: 4, color: sx?.color }}
  >
    <path
      fill="currentColor"
      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
    />
  </svg>
);

export default Community;