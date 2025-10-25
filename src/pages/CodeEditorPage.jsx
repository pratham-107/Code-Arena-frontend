import React from "react";
import { Box } from "@mui/material";
import CodeEditor from "../components/CodeEditor";

const CodeEditorPage = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "5px 10px"
      }}
    >
      <CodeEditor />
    </Box>
  );
};

export default CodeEditorPage;
