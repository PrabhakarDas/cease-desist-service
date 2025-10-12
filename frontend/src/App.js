import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Button } from "@mui/material";
import HeroSection from "./components/HeroSection";
import FileUpload from "./components/FileUpload";
import Footer from "./components/Footer";
import "./App.css"; // Import the updated CSS file
import CustomLogo from "./assets/custom-logo.png"; // Path to your custom logo

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
      <header className="App-header">
        <img src={CustomLogo} className="App-logo" alt="Custom Logo" />
      </header>
      <HeroSection />
      <FileUpload />
      <Footer />
    </ThemeProvider>
  );
}

export default App;