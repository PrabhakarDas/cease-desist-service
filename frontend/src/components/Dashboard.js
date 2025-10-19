import React, { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, Paper, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText } from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null); // Metrics data
  const [recentData, setRecentData] = useState(null); // Recent data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [activeTab, setActiveTab] = useState(0); // Active sub-tab
  const [filters, setFilters] = useState({}); // Filters for each tab

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get("http://localhost:8000/dashboard/metrics/");
        setMetrics(response.data.metrics);
        setRecentData(response.data.recent_data);

        // Initialize filters for each tab
        setFilters({
          audit_logs: {},
          approved_documents: {},
          classification_logs: {},
          further_evaluation: {},
        });
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        setError("Failed to fetch dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (tabKey, columnKey, selectedValues) => {
    setFilters((prev) => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        [columnKey]: selectedValues,
      },
    }));
  };

  const applyFilters = (data, filters) => {
    return data.filter((row) =>
      Object.keys(filters).every((columnKey) => {
        if (!filters[columnKey] || filters[columnKey].length === 0) {
          return true; // No filter applied for this column
        }
        return filters[columnKey].includes(row[columnKey]);
      })
    );
  };

  const renderTable = (data, tabKey) => {
    const filteredData = applyFilters(data, filters[tabKey] || {});

    return (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {Object.keys(data[0] || {}).map((key) => (
              <th key={key} style={{ border: "1px solid #ddd", padding: "8px" }}>
                {key}
                <FormControl fullWidth sx={{ marginTop: "10px" }}>
                  <InputLabel>{`Filter ${key}`}</InputLabel>
                  <Select
                    multiple
                    value={filters[tabKey]?.[key] || []}
                    onChange={(e) => handleFilterChange(tabKey, key, e.target.value)}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {[...new Set(data.map((row) => row[key]))].map((value) => (
                      <MenuItem key={value} value={value}>
                        <Checkbox checked={filters[tabKey]?.[key]?.includes(value)} />
                        <ListItemText primary={value} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, idx) => (
                <td key={idx} style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Metrics Section */}
      <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6">Metrics</Typography>
        <Typography>Total Audit Logs: {metrics.total_audit_logs}</Typography>
        <Typography>Total Approved Documents: {metrics.total_approved_documents}</Typography>
        <Typography>Total Further Evaluation: {metrics.total_further_evaluation}</Typography>
        <Typography>Total Classification Logs: {metrics.total_classification_logs}</Typography>
      </Paper>

      {/* Sub-Tabs for Recent Data */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Audit Logs" />
        <Tab label="Approved Documents" />
        <Tab label="Classification Logs" />
        <Tab label="Further Evaluation" />
      </Tabs>

      <Box sx={{ marginTop: "20px" }}>
        {activeTab === 0 && (
          <Paper sx={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Recent Audit Logs
            </Typography>
            {renderTable(recentData.audit_logs, "audit_logs")}
          </Paper>
        )}
        {activeTab === 1 && (
          <Paper sx={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Recent Approved Documents
            </Typography>
            {renderTable(recentData.approved_documents, "approved_documents")}
          </Paper>
        )}
        {activeTab === 2 && (
          <Paper sx={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Recent Classification Logs
            </Typography>
            {renderTable(recentData.classification_logs, "classification_logs")}
          </Paper>
        )}
        {activeTab === 3 && (
          <Paper sx={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              Recent Further Evaluation
            </Typography>
            {renderTable(recentData.further_evaluation, "further_evaluation")}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;