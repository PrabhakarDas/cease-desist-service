import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const HeroSection = () => {
  const theme = useTheme(); // Access the current theme (dark or light)

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "50px",
        backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#f5f5f5",
        marginBottom: "20px",
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        Cease & Desist Classification
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: theme.palette.text.secondary }}
      >
        Upload scanned documents and classify them into Cease, Uncertain, or Irrelevant categories.
      </Typography>
    </Box>
  );
};

export default HeroSection;