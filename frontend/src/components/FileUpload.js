import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button, Card, CardContent, Alert, useTheme } from "@mui/material";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const theme = useTheme(); // Access the current theme (dark or light)

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".jpg,.jpeg,.png,.pdf", // Accept specific file types
    multiple: false, // Allow only one file at a time
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setResult(null);
        setError(null);
      } else {
        setError("Invalid file type. Please upload a valid file.");
      }
    },
  });

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred while uploading the file.");
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "20px",
          backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#f9f9f9",
        }}
      >
        <input {...getInputProps()} />
        <Typography sx={{ color: theme.palette.text.primary }}>
          Drag & drop a file here, or click to select one
        </Typography>
        {file && (
          <Typography variant="body2" sx={{ marginTop: "10px", color: theme.palette.text.secondary }}>
            Selected File: {file.name}
          </Typography>
        )}
      </Box>
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
      {result && (
        <Card sx={{ marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6">Classification Result</Typography>
            <Typography><strong>Filename:</strong> {result.filename}</Typography>
            <Typography><strong>Classification:</strong> {result.classification}</Typography>
            <Typography variant="body1" sx={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
              <strong>Extracted Text:</strong> {result.extracted_text}
            </Typography>
          </CardContent>
        </Card>
      )}
      {error && (
        <Alert severity="error" sx={{ marginTop: "20px" }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;