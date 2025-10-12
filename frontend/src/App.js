import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Button } from "@mui/material";
import HeroSection from "./components/HeroSection";
import FileUpload from "./components/FileUpload";
import Footer from "./components/Footer";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button
        onClick={() => setDarkMode(!darkMode)}
        variant="contained"
        sx={{ position: "absolute", top: "10px", right: "10px" }}
      >
        Toggle Dark Mode
      </Button>
      <HeroSection />
      <FileUpload />
      <Footer />
    </ThemeProvider>
  );
}

export default App;