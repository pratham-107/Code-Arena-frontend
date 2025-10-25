import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  FormControl, 
  InputLabel,
  Select, 
  MenuItem, 
  Button, 
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Snackbar,
  Alert as MuiAlert
} from "@mui/material";
import { PlayArrow, Send, Code as CodeIcon, Save as SaveIcon, CheckCircle } from "@mui/icons-material";
import Editor from "@monaco-editor/react";
import { codeAPI } from "../services/api";
import { solutionsAPI } from "../services/solutionsAPI";
import { getCurrentUser } from "../services/auth";

// Define language options (excluding HTML and CSS as per requirements)
const languageOptions = [
  { value: "javascript", label: "JavaScript", template: "// Write your JavaScript code here\nfunction solution() {\n  // Your code here\n}\n\nsolution();" },
  { value: "python", label: "Python", template: "# Write your Python code here\ndef solution():\n    # Your code here\n    pass\n\nsolution()" },
  { value: "java", label: "Java", template: "// Write your Java code here\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}" },
  { value: "cpp", label: "C++", template: "// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}" },
  { value: "csharp", label: "C#", template: "// Write your C# code here\nusing System;\n\nclass Program {\n    static void Main() {\n        // Your code here\n    }\n}" },
  { value: "typescript", label: "TypeScript", template: "// Write your TypeScript code here\nfunction solution(): void {\n  // Your code here\n}\n\nsolution();" },
];

const CodeEditor = ({ problemId }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const editorRef = useRef();

  // Set default template when language changes
  useEffect(() => {
    const selectedLanguage = languageOptions.find(option => option.value === language);
    if (selectedLanguage) {
      setCode(selectedLanguage.template);
    }
  }, [language]);

  // Load user's saved solution when component mounts
  useEffect(() => {
    const loadSavedSolution = async () => {
      if (!problemId) return;
      
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) return;
        
        const response = await solutionsAPI.getSolution(currentUser.id, problemId);
        if (response.data.success) {
          const solution = response.data.data.solution;
          setCode(solution.code);
          setLanguage(solution.language);
          setIsSolved(solution.isSolved || false);
        }
      } catch (err) {
        // If solution doesn't exist, that's fine - we'll use the default template
        console.log("No saved solution found for this problem");
      }
    };
    
    loadSavedSolution();
  }, [problemId]);

  // Handle editor mount
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  // Handle run code
  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setError("");
      setOutput("Running code...");
      
      const response = await codeAPI.executeCode({ sourceCode: code, language });
      
      if (response.data.success) {
        const result = response.data.data.result;
        
        if (result.stdout) {
          setOutput(result.stdout);
        } else if (result.stderr) {
          setOutput(`Error: ${result.stderr}`);
        } else if (result.compile_output) {
          setOutput(`Compilation Error: ${result.compile_output}`);
        } else {
          setOutput("Code executed successfully with no output.");
        }
      } else {
        setError(response.data.message || "Failed to execute code");
      }
    } catch (err) {
      console.error("Error running code:", err);
      setError("Failed to execute code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  // Handle submit (for problem solving)
  const handleSubmit = async () => {
    try {
      setIsRunning(true);
      setError("");
      setOutput("Submitting solution...");
      
      // In a real implementation, you would:
      // 1. Run the code against test cases
      // 2. Check if all test cases pass
      // 3. Save the submission to the database
      // 4. Show the result
      
      // For now, we'll just run the code and simulate a successful submission
      await handleRunCode();
      
      // Simulate submission process and mark as solved
      setTimeout(() => {
        setOutput(`Solution submitted for problem ${problemId}!\n${output}`);
        setIsSolved(true);
        
        // Save the solution as solved
        handleSaveSolution(true);
        
        // Show success message
        setSnackbar({
          open: true,
          message: "Congratulations! Problem solved successfully!",
          severity: "success",
        });
      }, 1000);
    } catch (err) {
      console.error("Error submitting code:", err);
      setError("Failed to submit solution. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  // Save user's solution
  const handleSaveSolution = async (markAsSolved = false) => {
    try {
      setIsSaving(true);
      setError("");
      
      const currentUser = getCurrentUser();
      if (!currentUser) {
        setError("You must be logged in to save solutions");
        return;
      }
      
      if (!problemId) {
        setError("No problem ID provided");
        return;
      }
      
      // For individual problems, we don't need to parse contestId
      // For contest problems, we need to parse contestId and problemId
      let contestId = null;
      let solutionProblemId = problemId;
      
      // Check if it's a contest problem (contains '-')
      if (problemId.includes('-')) {
        const parts = problemId.split('-');
        contestId = parts[0];
        solutionProblemId = problemId; // Keep the full ID for contest problems
      } else {
        // For individual problems, the problemId is just the problem ID
        solutionProblemId = problemId;
      }
      
      const solutionData = {
        userId: currentUser.id,
        problemId: solutionProblemId,
        code: code,
        language: language,
        isSolved: markAsSolved || isSolved
      };
      
      // Only add contestId if it exists (for contest problems)
      if (contestId) {
        solutionData.contestId = contestId;
      }
      
      const response = await solutionsAPI.saveSolution(solutionData);
      
      if (response.data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
        
        // Update solved status if we're marking as solved
        if (markAsSolved) {
          setIsSolved(true);
          // Dispatch a custom event to notify other components that a problem was solved
          window.dispatchEvent(new CustomEvent('problemSolved', { detail: { problemId: solutionProblemId } }));
        }
      } else {
        setError(response.data.message || "Failed to save solution");
      }
    } catch (err) {
      console.error("Error saving solution:", err);
      setError("Failed to save solution. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Get selected language label
  const selectedLanguageLabel = languageOptions.find(option => option.value === language)?.label || "JavaScript";

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <Card 
        sx={{ 
          mb: 2, 
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CodeIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                Code Editor
              </Typography>
              <Chip 
                label={selectedLanguageLabel} 
                size="small" 
                sx={{ 
                  backgroundColor: "primary.main", 
                  color: "secondary.main",
                  fontWeight: 600
                }} 
              />
              {isSolved && (
                <Chip
                  icon={<CheckCircle />}
                  label="Solved"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
            
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {languageOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="contained"
                startIcon={isRunning ? <CircularProgress size={20} /> : <PlayArrow />}
                onClick={handleRunCode}
                disabled={isRunning}
                sx={{
                  backgroundColor: "primary.main",
                  color: "secondary.main",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  "&:hover": {
                    backgroundColor: "#333333",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Run Code
              </Button>
              
              {problemId && (
                <>
                  <Button
                    variant="contained"
                    startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={() => handleSaveSolution()}
                    disabled={isSaving}
                    sx={{
                      backgroundColor: saveSuccess ? "success.main" : "info.main",
                      color: "secondary.main",
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      "&:hover": {
                        backgroundColor: saveSuccess ? "success.dark" : "info.dark",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {saveSuccess ? "Saved!" : "Save"}
                  </Button>
                  
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={handleSubmit}
                    disabled={isRunning}
                    sx={{
                      backgroundColor: "success.main",
                      color: "secondary.main",
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      "&:hover": {
                        backgroundColor: "#2e7d32",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Submit
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}
        >
          {error}
        </Alert>
      )}

      {/* Editor and Output Container */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" }, 
        gap: 3, 
        flexGrow: 1,
        minHeight: "500px"
      }}>
        {/* Code Editor Section */}
        <Box sx={{ 
          flex: 2, 
          display: "flex", 
          flexDirection: "column",
          minHeight: "400px"
        }}>
          <Card sx={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column",
            backgroundColor: "#1e1e1e",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            overflow: "hidden"
          }}>
            <Box sx={{ 
              backgroundColor: "#2d2d30", 
              px: 2, 
              py: 1, 
              display: "flex", 
              alignItems: "center"
            }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ff5f56" }}></Box>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#ffbd2e" }}></Box>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#27c93f" }}></Box>
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.7)", 
                  ml: 2,
                  fontWeight: 500
                }}
              >
                {selectedLanguageLabel}
              </Typography>
            </Box>
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value)}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontFamily: "Fira Code, Consolas, 'Courier New', monospace",
                fontLigatures: true,
                wordWrap: "on",
                smoothScrolling: true,
                scrollbar: {
                  vertical: "auto",
                  horizontal: "auto"
                }
              }}
            />
          </Card>
        </Box>

        {/* Output Section */}
        <Box sx={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          minHeight: "400px"
        }}>
          <Card sx={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column",
            backgroundColor: "#1e1e1e",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            overflow: "hidden"
          }}>
            <Box sx={{ 
              backgroundColor: "#2d2d30", 
              px: 2, 
              py: 1, 
              display: "flex", 
              alignItems: "center"
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.7)", 
                  fontWeight: 500
                }}
              >
                Output
              </Typography>
            </Box>
            <CardContent sx={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column",
              p: 0,
              "&:last-child": { pb: 0 }
            }}>
              <Box 
                sx={{ 
                  flex: 1, 
                  backgroundColor: "#000", 
                  p: 2, 
                  overflow: "auto",
                  color: "white",
                  fontFamily: "Fira Code, Consolas, 'Courier New', monospace",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5
                }}
              >
                {output || (
                  <Box sx={{ 
                    color: "rgba(255, 255, 255, 0.5)", 
                    fontStyle: "italic" 
                  }}>
                    Run your code to see the output here
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default CodeEditor;