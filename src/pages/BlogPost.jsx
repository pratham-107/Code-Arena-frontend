import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Person,
  AccessTime,
  Visibility,
  Favorite,
  Share,
  Comment,
  Send,
} from "@mui/icons-material";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // Mock blog post data
  const mockPosts = {
    "1": {
      _id: "1",
      title: "Getting Started with Competitive Programming",
      content: `Competitive programming is a mind sport where participants solve well-defined problems by writing computer programs under specified constraints. It's an excellent way to improve your problem-solving skills and algorithmic thinking.

Key Benefits:
1. Improves logical reasoning and analytical skills
2. Enhances understanding of data structures and algorithms
3. Prepares you for technical interviews
4. Builds confidence in coding under time pressure

Getting Started:
1. Choose a programming language (C++, Java, or Python are popular choices)
2. Learn basic data structures (arrays, linked lists, stacks, queues, trees, graphs)
3. Master fundamental algorithms (sorting, searching, dynamic programming)
4. Practice regularly on platforms like Codeforces, LeetCode, or HackerRank
5. Participate in contests to test your skills under time pressure

Essential Tips:
- Start with easier problems and gradually increase difficulty
- Analyze solutions after contests to learn from mistakes
- Focus on understanding concepts rather than memorizing solutions
- Join online communities to discuss problems and solutions
- Be consistent with practice - even 30 minutes daily can make a difference

Remember, competitive programming is not just about winning contests. It's about developing a problem-solving mindset that will benefit you throughout your career as a software developer.`,
      author: { name: "Alex Johnson" },
      category: "Beginner Guides",
      tags: ["Algorithms", "Tips", "Beginner"],
      views: 1250,
      likes: 42,
      createdAt: "2023-05-15T10:30:00Z",
      comments: [
        {
          _id: "c1",
          content: "Great introduction! I'm just starting out and this is very helpful.",
          author: { name: "NewCoder" },
          likes: 5,
          createdAt: "2023-05-16T14:22:00Z"
        },
        {
          _id: "c2",
          content: "I would also recommend participating in virtual contests to simulate real competition pressure.",
          author: { name: "ContestVeteran" },
          likes: 8,
          createdAt: "2023-05-17T09:15:00Z"
        }
      ]
    },
    "2": {
      _id: "2",
      title: "Mastering Dynamic Programming",
      content: `Dynamic Programming (DP) is one of the most important topics in competitive programming. It's a technique used to solve optimization problems by breaking them down into simpler subproblems and storing the results of subproblems to avoid recomputing them.

Core Concepts:
1. Overlapping Subproblems: The problem can be broken down into subproblems which are reused several times.
2. Optimal Substructure: Optimal solution to the problem can be constructed from optimal solutions of its subproblems.

Common DP Patterns:
1. Linear DP: Problems where the state depends on previous states in a linear fashion (e.g., Fibonacci sequence)
2. Grid DP: Problems involving 2D grids where you move in specific directions
3. Tree DP: Problems on tree data structures where you compute values for subtrees
4. Bitmask DP: Problems where you use bitmasks to represent states
5. Digit DP: Problems involving digits of numbers

Problem-Solving Approach:
1. Identify if the problem has overlapping subproblems and optimal substructure
2. Define the state - what information do you need to represent a subproblem?
3. Formulate the recurrence relation - how do subproblems relate to the main problem?
4. Determine the base cases
5. Decide on implementation approach (top-down recursion with memoization or bottom-up iteration)
6. Optimize space complexity if possible

Practice Problems:
- Fibonacci sequence (basic)
- Longest Common Subsequence (classic)
- Coin Change (intermediate)
- Knapsack Problem (must-know)
- Matrix Chain Multiplication (advanced)

Tips for Mastering DP:
- Practice identifying patterns in problems
- Start with recursive solutions and then optimize with memoization
- Draw state transition diagrams for complex problems
- Understand the time and space complexity of your solutions
- Practice converting top-down to bottom-up approaches`,
      author: { name: "Sarah Chen" },
      category: "Advanced Techniques",
      tags: ["DP", "Optimization", "Interviews"],
      views: 2100,
      likes: 87,
      createdAt: "2023-06-22T11:45:00Z",
      comments: [
        {
          _id: "c3",
          content: "This is exactly what I needed! The pattern breakdown is very helpful.",
          author: { name: "DP_Learner" },
          likes: 12,
          createdAt: "2023-06-23T16:30:00Z"
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      if (mockPosts[id]) {
        setPost(mockPosts[id]);
        setLikes(mockPosts[id].likes);
        setComments(mockPosts[id].comments || []);
        setError(null);
      } else {
        setError("Blog post not found");
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
    } else {
      setLikes(Math.max(0, likes - 1));
    }
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      _id: `c${comments.length + 1}`,
      content: newComment,
      author: { name: "You" },
      likes: 0,
      createdAt: new Date().toISOString()
    };

    setComments([...comments, comment]);
    setNewComment("");
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

  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: "background.default",
          py: 4,
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Container>
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
        <Card sx={{ mb: 4, backgroundColor: "background.paper" }}>
          <CardContent>
            {/* Post Header */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Chip 
                  label={post.category} 
                  size="small" 
                  variant="outlined"
                  sx={{ 
                    borderColor: "primary.main", 
                    color: "primary.main",
                    fontWeight: 600,
                    fontSize: '1rem',
                    padding: '5px 10px'
                  }}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Visibility sx={{ fontSize: 18, color: "text.secondary" }} />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {post.views}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Favorite 
                      sx={{ 
                        fontSize: 18, 
                        color: liked ? "error.main" : "text.secondary",
                        cursor: "pointer"
                      }} 
                      onClick={handleLike}
                    />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {likes}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <Share sx={{ fontSize: 18, color: "text.secondary" }} />
                  </IconButton>
                </Box>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  color: "primary.main",
                }}
              >
                {post.title}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {(post.author?.name || "U").charAt(0)}
                  </Avatar>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {post.author?.name || "Unknown"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Post Content */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  whiteSpace: "pre-line",
                  fontSize: '1.1rem',
                  lineHeight: 1.7
                }}
              >
                {post.content}
              </Typography>
            </Box>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {post.tags.map((tag, index) => (
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
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card sx={{ backgroundColor: "background.paper" }}>
          <CardContent>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: "primary.main",
              }}
            >
              Comments ({comments.length})
            </Typography>

            {/* Add Comment */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </Button>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Comments List */}
            {comments.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {comments.map((comment) => (
                  <Box key={comment._id} sx={{ display: "flex", gap: 2 }}>
                    <Avatar sx={{ width: 36, height: 36 }}>
                      {(comment.author?.name || "U").charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {comment.author?.name || "Unknown"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: "text.primary", mb: 1 }}>
                        {comment.content}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}>
                          <Favorite sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {comment.likes || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}>
                          <Comment sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Reply
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center", py: 2 }}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default BlogPost;