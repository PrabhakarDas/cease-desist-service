import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box, Button, Tabs, Tab } from "@mui/material";
import ChatInterface from "./components/ChatInterface";
import Dashboard from "./components/Dashboard"; // Import the new Dashboard component
import "./App.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [activeTab, setActiveTab] = useState(0); // Tab state

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ padding: "20px", textAlign: "center" }}>
        {/* Dark Mode Toggle Button */}
        <Button
          variant="contained"
          onClick={() => setDarkMode(!darkMode)}
          sx={{ marginBottom: "20px" }}
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </Button>

        {/* Tabs for Navigation */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ marginBottom: "20px" }}
        >
          <Tab label="Chat Interface" />
          <Tab label="Dashboard" />
        </Tabs>

        {/* Render the Active Tab */}
        <Box>
          {activeTab === 0 && <ChatInterface />}
          {activeTab === 1 && <Dashboard />}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;