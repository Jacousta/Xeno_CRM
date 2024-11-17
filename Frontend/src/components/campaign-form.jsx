import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

export default function CampaignForm() {
  const [formData, setFormData] = useState({
    name: "",
    segmentField: "totalSpending",
    segmentOperator: ">",
    segmentValue: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const segment = {
        [formData.segmentField]: {
          [formData.segmentOperator]: parseFloat(formData.segmentValue),
        },
      };
      const payload = {
        name: formData.name,
        segment,
        message: formData.message,
      };
      console.log("Sending payload:", payload);
      const response = await axios.post(
        "/api/campaigns",
        payload
      );
      console.log("Server response:", response.data);
      setSnackbar({
        open: true,
        message: "Campaign created successfully!",
        severity: "success",
      });
      setFormData({
        name: "",
        segmentField: "totalSpending",
        segmentOperator: ">",
        segmentValue: "",
        message: "",
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      let errorMessage = "Error creating campaign. Please try again.";
      if (error.response) {
        console.log("Error response:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage =
          "No response received from server. Please check your connection.";
      }
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto" }}
    >
      <Typography variant="h4" gutterBottom>
        Create Campaign
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Campaign Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Segment Field</InputLabel>
        <Select
          name="segmentField"
          value={formData.segmentField}
          onChange={handleChange}
          required
        >
          <MenuItem value="totalSpending">Total Spending</MenuItem>
          <MenuItem value="visits">Visits</MenuItem>
          <MenuItem value="lastVisit">Last Visit</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Segment Operator</InputLabel>
        <Select
          name="segmentOperator"
          value={formData.segmentOperator}
          onChange={handleChange}
          required
        >
          <MenuItem value=">">Greater than</MenuItem>
          <MenuItem value="<">Less than</MenuItem>
          <MenuItem value="=">Equal to</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Segment Value"
        name="segmentValue"
        type="number"
        value={formData.segmentValue}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Message"
        name="message"
        multiline
        rows={4}
        value={formData.message}
        onChange={handleChange}
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Campaign"}
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
