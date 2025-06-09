import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { courtAPI } from "../services/api";

const CourtFormDialog = ({ open, onClose, court, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    hourlyPrice: "",
    courtType: "INDOOR",
    images: [],
    subCourts: [],
  });

  useEffect(() => {
    if (court) {
      setFormData({
        name: court.name || "",
        address: court.address || "",
        description: court.description || "",
        hourlyPrice: court.hourlyPrice || "",
        courtType: court.courtType || "INDOOR",
        images: [],
        subCourts: court.subCourts || [],
      });
    } else {
      setFormData({
        name: "",
        address: "",
        description: "",
        hourlyPrice: "",
        courtType: "INDOOR",
        images: [],
        subCourts: [],
      });
    }
  }, [court]);

  const handleAddSubCourt = () => {
    setFormData({
      ...formData,
      subCourts: [...formData.subCourts, { name: "" }],
    });
  };

  const handleRemoveSubCourt = (index) => {
    const newSubCourts = formData.subCourts.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subCourts: newSubCourts,
    });
  };

  const handleSubCourtChange = (index, field, value) => {
    const newSubCourts = [...formData.subCourts];
    newSubCourts[index] = { ...newSubCourts[index], [field]: value };
    setFormData({
      ...formData,
      subCourts: newSubCourts,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("address", formData.address);
    form.append("description", formData.description);
    form.append("hourlyPrice", formData.hourlyPrice);
    form.append("courtType", formData.courtType);
    formData.subCourts.forEach((subCourt, idx) => {
      form.append(`subCourts[${idx}].name`, subCourt.name);
    });

    formData.images.forEach((file) => {
      form.append("images", file);
    });

    try {
      if (court) {
        await courtAPI.updateCourt(court.id, form);
        toast.success("Court updated");
      } else {
        for (let [key, value] of form.entries()) {
          console.log(`${key}:`, value);
        }
        await courtAPI.createCourt(form);
        toast.success("Court created");
      }
      onClose();
      onSuccess();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{court ? "Edit Court" : "Add New Court"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Court Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            label="Price per Hour"
            type="number"
            value={formData.hourlyPrice}
            onChange={(e) =>
              setFormData({ ...formData, hourlyPrice: e.target.value })
            }
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Court Type"
            value={formData.courtType}
            onChange={(e) =>
              setFormData({ ...formData, courtType: e.target.value })
            }
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="INDOOR">Indoor</MenuItem>
            <MenuItem value="OUTDOOR">Outdoor</MenuItem>
          </TextField>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sub Courts
            </Typography>
            {formData.subCourts.map((subCourt, index) => (
              <Box
                key={index}
                sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Sub Court Name"
                    value={subCourt.name}
                    onChange={(e) =>
                      handleSubCourtChange(index, "name", e.target.value)
                    }
                    fullWidth
                    required
                  />
                  <IconButton
                    onClick={() => handleRemoveSubCourt(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddSubCourt}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Add Sub Court
            </Button>
          </Box>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, images: Array.from(e.target.files) })
              }
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {court ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourtFormDialog;
