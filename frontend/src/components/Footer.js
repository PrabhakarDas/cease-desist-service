import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme(); // Access the current theme (dark or light)

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
        marginTop: "50px",
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.secondary }}
      >
        © 2025 Cease & Desist Classification. All rights reserved.
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: theme.palette.text.primary }}
      >
        <a
          href="https://github.com/your-username/cease-desist-classification"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.palette.text.primary, textDecoration: "none" }}
        >
          GitHub Repository
        </a>
      </Typography>
    </Box>
  );
};

export default Footer;