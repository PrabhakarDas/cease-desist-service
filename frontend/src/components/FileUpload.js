import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Box, Alert, Card, CardContent } from "@mui/material";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null);
    setError(null);
  };

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
      <Typography variant="h4" align="center" gutterBottom>
        Cease & Desist Classification
      </Typography>
      <Box sx={{ marginBottom: "20px" }}>
        <TextField type="file" onChange={handleFileChange} fullWidth />
        <Button variant="contained" color="primary" onClick={handleUpload} sx={{ marginTop: "10px" }}>
          Upload
        </Button>
      </Box>
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