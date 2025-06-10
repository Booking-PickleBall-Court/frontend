import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  Paper,
} from "@mui/material";
import { courtAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    hourlyPrice: "",
    courtType: "OUTDOOR",
    images: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await courtAPI.getAllCourts();
      console.log("Courts data:", response.data);
      setCourts(response.data);
    } catch (err) {
      setError("Failed to fetch courts");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (court = null) => {
    if (court) {
      setSelectedCourt(court);
      setFormData({
        name: court.name,
        address: court.address,
        description: court.description,
        hourlyPrice: court.hourlyPrice,
        courtType: court.courtType,
        images: court.imageUrls || [],
      });
    } else {
      setSelectedCourt(null);
      setFormData({
        name: "",
        address: "",
        description: "",
        hourlyPrice: "",
        courtType: "OUTDOOR",
        images: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourt(null);
    setFormData({
      name: "",
      address: "",
      description: "",
      hourlyPrice: "",
      courtType: "OUTDOOR",
      images: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("address", formData.address);
      form.append("description", formData.description);
      form.append("hourlyPrice", formData.hourlyPrice);
      form.append("courtType", formData.courtType);

      formData.images.forEach((file) => {
        form.append("images", file);
      });

      if (selectedCourt) {
        await courtAPI.updateCourt(selectedCourt.id, form);
      } else {
        await courtAPI.createCourt(form);
      }
      handleCloseDialog();
      fetchCourts();
    } catch (err) {
      setError("Failed to save court");
    }
  };

  const handleDelete = async (courtId) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      try {
        await courtAPI.deleteCourt(courtId);
        fetchCourts();
      } catch (err) {
        setError("Failed to delete court");
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Courts
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add New Court
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {courts.map((court) => (
            <Grid item xs={12} sm={6} md={4} key={court.id}>
              <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
                <img
                  src={court.imageUrls?.[0] || "/placeholder.jpg"}
                  alt={court.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  {court.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Address: {court.address}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Hourly Price: ${court.hourlyPrice}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Type: {court.courtType}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Status: {court.status}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {court.description}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleOpenDialog(court)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(court.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/courts/${court.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {selectedCourt ? "Edit Court" : "Add New Court"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Hourly Price"
                name="hourlyPrice"
                type="number"
                value={formData.hourlyPrice}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyPrice: e.target.value })
                }
                required
              />
              <TextField
                fullWidth
                margin="normal"
                select
                label="Court Type"
                name="courtType"
                value={formData.courtType}
                onChange={(e) =>
                  setFormData({ ...formData, courtType: e.target.value })
                }
                required
              >
                <MenuItem value="INDOOR">Indoor</MenuItem>
                <MenuItem value="OUTDOOR">Outdoor</MenuItem>
              </TextField>
              <Box sx={{ mt: 2 }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: Array.from(e.target.files),
                    })
                  }
                />
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} color="primary">
              {selectedCourt ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default Courts;
