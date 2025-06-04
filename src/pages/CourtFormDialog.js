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
} from "@mui/material";
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
      });
    } else {
      setFormData({
        name: "",
        address: "",
        description: "",
        hourlyPrice: "",
        courtType: "INDOOR",
        images: [],
      });
    }
  }, [court]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("address", formData.address);
    form.append("description", formData.description);
    form.append("hourlyPrice", formData.hourlyPrice);
    form.append("courtType", formData.courtType);

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
