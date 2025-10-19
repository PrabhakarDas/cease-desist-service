import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from "@mui/material";
import axios from "axios";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]); // Conversation history
  const [userMessage, setUserMessage] = useState(""); // Current user input
  const [loading, setLoading] = useState(false); // Loading state
  const [file, setFile] = useState(null); // Single file for upload
  const [bulkFiles, setBulkFiles] = useState([]); // Multiple files for bulk upload
  const [classificationResult, setClassificationResult] = useState(null); // Classification result for single file
  const [bulkResults, setBulkResults] = useState([]); // Results for bulk upload
  const [error, setError] = useState(null); // Error message

  // Handle single file selection
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(null); // Clear previous errors
    }
  };

  // Handle bulk file selection
  const handleBulkFileChange = (event) => {
    if (event.target.files.length > 0) {
      setBulkFiles([...event.target.files]); // Store multiple files
      setError(null); // Clear previous errors
    }
  };

  // Handle single file upload
  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      let { classification, filename, audit_status, agent_status, language } = response.data;

      // Normalize classification (remove extra quotes if present)
      classification = classification.replace(/['"]+/g, ""); // Remove extra quotes

      // Determine the action based on classification
      let action = "";
      if (classification === "Cease") {
        action = "Details have been written to the datastore.";
      } else if (classification === "Uncertain") {
        action = "Requires manual review. Please review the document.";
      } else if (classification === "Irrelevant") {
        action = "Archived successfully.";
      }

      // Store the classification result
      setClassificationResult({
        filename,
        classification,
        action,
        language: language || "Unknown", // Include detected language
        auditStatus: audit_status?.status || "Audit status not available",
        agentStatus: agent_status?.status || "Agent status not available",
      });

      setFile(null); // Clear the file after processing
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.response?.data?.detail || "An error occurred while uploading the file.");
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk file upload
  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();
    bulkFiles.forEach((file) => formData.append("files", file)); // Append multiple files

    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:8000/bulk_upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setBulkResults(response.data.results); // Store results for all files
      setBulkFiles([]); // Clear the files after processing
    } catch (error) {
      console.error("Error uploading files:", error);
      setError(error.response?.data?.detail || "An error occurred while uploading the files.");
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a chat message
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setUserMessage(""); // Clear input
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:8000/chat/", {
        messages: newMessages,
        language: classificationResult?.language || "unknown", // Include detected language
      });

      setMessages([
        ...newMessages,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("An error occurred while sending the message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      {/* Single File Upload Section */}
      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Upload a Document for Classification
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            variant="contained"
            component="label"
            color="primary"
            disabled={loading}
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
            onClick={handleFileUpload}
            disabled={loading || !file}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Upload"}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ marginTop: "20px" }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Classification Result Section */}
      {classificationResult && (
        <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">Classification Result</Typography>
          <Typography><strong>Filename:</strong> {classificationResult.filename}</Typography>
          <Typography><strong>Classification:</strong> {classificationResult.classification}</Typography>
          <Typography><strong>Detected Language:</strong> {classificationResult.language}</Typography>
          <Alert
            severity={
              classificationResult.classification === "Cease"
                ? "success"
                : classificationResult.classification === "Uncertain"
                ? "warning"
                : "info"
            }
            sx={{ marginTop: "10px" }}
          >
            {classificationResult.action}
          </Alert>
        </Paper>
      )}

      {/* Bulk Upload Section */}
      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Bulk Upload Documents for Classification
        </Typography>
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            variant="contained"
            component="label"
            color="primary"
            disabled={loading}
          >
            Select Files
            <input type="file" hidden multiple onChange={handleBulkFileChange} />
          </Button>
          {bulkFiles.length > 0 && (
            <Typography variant="body2" sx={{ marginLeft: "10px" }}>
              Selected Files: {bulkFiles.length}
            </Typography>
          )}
          <Button
            variant="contained"
            color="success"
            onClick={handleBulkUpload}
            disabled={loading || bulkFiles.length === 0}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Upload"}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ marginTop: "20px" }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* Bulk Upload Results */}
      {bulkResults.length > 0 && (
        <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
          <Typography variant="h6">Bulk Upload Results</Typography>
          {bulkResults.map((result, index) => (
            <Box key={index} sx={{ marginBottom: "20px" }}>
              <Typography><strong>Filename:</strong> {result.filename}</Typography>
              {result.error ? (
                <Typography color="error"><strong>Error:</strong> {result.error}</Typography>
              ) : (
                <>
                  <Typography><strong>Classification:</strong> {result.classification}</Typography>
                  <Typography><strong>Detected Language:</strong> {result.language}</Typography>
                  <Typography><strong>Audit Status:</strong> {result.audit_status?.status || "N/A"}</Typography>
                  <Typography><strong>Agent Status:</strong> {result.agent_status?.status || "N/A"}</Typography>
                </>
              )}
            </Box>
          ))}
        </Paper>
      )}

      {/* Chat Section */}
      <Paper sx={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Chat with AI Assistant
        </Typography>
        <Box sx={{ maxHeight: "400px", overflowY: "auto", marginBottom: "20px" }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                textAlign: msg.role === "user" ? "right" : "left",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: msg.role === "user" ? "#1976d2" : "#e0e0e0",
                  color: msg.role === "user" ? "#fff" : "#000",
                }}
              >
                {msg.content}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Send"}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ marginTop: "20px" }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default ChatInterface;