import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const CheatSheet = () => {
  const theme = useTheme(); // Access the current theme (dark or light)

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
        margin: "20px auto",
        maxWidth: "800px",
        borderRadius: "8px",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
        LangChain OpenAI → Ollama Cheat Sheet
      </Typography>
      <Typography variant="body1" sx={{ color: theme.palette.text.secondary, whiteSpace: "pre-wrap" }}>
        🧠 LangChain OpenAI → Ollama Cheat Sheet
        🔧 Setup
        Feature OpenAI Ollama
        API Key OPENAI_API_KEY Not required
        Host api.openai.com http://localhost:11434
        ...
      </Typography>
    </Box>
  );
};

export default CheatSheet;