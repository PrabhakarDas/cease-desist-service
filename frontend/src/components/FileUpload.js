import React, { useState } from "react";
import { Box, Button, Typography, Alert, CircularProgress } from "@mui/material";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null); // Selected file
  const [uploading, setUploading] = useState(false); // Uploading state
  const [error, setError] = useState(null); // Error message
  const [successMessage, setSuccessMessage] = useState(null); // Success message

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(null); // Clear any previous errors
      setSuccessMessage(null); // Clear any previous success messages
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success response
      setSuccessMessage(`File "${response.data.filename}" uploaded successfully! Classification: ${response.data.classification}`);
      setFile(null); // Clear the selected file
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.response?.data?.detail || "An error occurred while uploading the file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Upload a Document
      </Typography>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
        <Button
          variant="contained"
          component="label"
          color="primary"
          disabled={uploading}
        >
          Select File
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {file && (
          <Typography variant="body2" sx={{ marginLeft: "10px" }}>
            Selected File: {file.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="success"
          onClick={handleUpload}
          disabled={uploading || !file}
        >
          {uploading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Upload"}
        </Button>
      </Box>

      {/* Display success message */}
      {successMessage && (
        <Alert severity="success" sx={{ marginTop: "20px" }}>
          {successMessage}
        </Alert>
      )}

      {/* Display error message */}
      {error && (
        <Alert severity="error" sx={{ marginTop: "20px" }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;