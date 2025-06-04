import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import CourtTable from "./CourtTable";
import CourtFormDialog from "./CourtFormDialog";
import { courtAPI } from "../services/api";

const drawerWidth = 240;

const CourtManagement = () => {
  const [courts, setCourts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await courtAPI.getAllCourts();
      setCourts(response.data);
    } catch (error) {
      toast.error("Failed to fetch courts");
    }
  };

  const handleOpenDialog = (court = null) => {
    setSelectedCourt(court);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCourt(null);
    setOpenDialog(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Container maxWidth="xl" sx={{ mt: 12, mb: 12 }}>
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5">
                      Court Management ({courts.length} total)
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                    >
                      Add New Court
                    </Button>
                  </Box>

                  <CourtTable
                    courts={courts}
                    onEdit={handleOpenDialog}
                    onDeleteSuccess={fetchCourts}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <CourtFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        court={selectedCourt}
        onSuccess={fetchCourts}
      />
    </Box>
  );
};

export default CourtManagement;
