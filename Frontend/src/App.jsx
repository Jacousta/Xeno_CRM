import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Container, Button } from "@mui/material";
import CustomerList from "./components/customer-list";
import CampaignList from "./components/campaign-list";
import CampaignForm from "./components/campaign-form";

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mini CRM
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Customers
          </Button>
          <Button color="inherit" component={Link} to="/campaigns">
            Campaigns
          </Button>
          <Button color="inherit" component={Link} to="/create-campaign">
            Create Campaign
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/campaigns" element={<CampaignList />} />
          <Route path="/create-campaign" element={<CampaignForm />} />
        </Routes>
      </Container>
    </Router>
  );
}
