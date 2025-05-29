import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Folder as FolderIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Link as LinkIcon,
  Lock as LockIcon,
  Help as HelpIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const drawerWidth = 240;

const CourtManagement = () => {
  const [courts, setCourts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    status: "available",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      // TODO: Implement API call to fetch courts
      // const response = await fetch("/api/courts/owner");
      // const data = await response.json();
      // setCourts(data);

      // Mock data
      const mockCourts = [
        {
          id: 1,
          name: "Court 1",
          description: "Standard court",
          price: 25,
          status: "available",
        },
        {
          id: 2,
          name: "Court 2",
          description: "Premium court",
          price: 35,
          status: "available",
        },
        {
          id: 3,
          name: "Court 3",
          description: "Indoor court",
          price: 40,
          status: "maintenance",
        },
        {
          id: 4,
          name: "Court 4",
          description: "Outdoor court",
          price: 20,
          status: "available",
        },
      ];

      setTimeout(() => {
        setCourts(mockCourts);
      }, 500);
    } catch (error) {
      toast.error("Failed to fetch courts");
    }
  };

  const handleOpenDialog = (court = null) => {
    if (court) {
      setSelectedCourt(court);
      setFormData({
        name: court.name,
        description: court.description,
        price: court.price,
        status: court.status,
      });
    } else {
      setSelectedCourt(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        status: "available",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourt(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      status: "available",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCourt) {
        // Update existing court
        await fetch(`/api/courts/${selectedCourt.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        toast.success("Court updated successfully");
      } else {
        // Create new court
        await fetch("/api/courts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        toast.success("Court created successfully");
      }
      handleCloseDialog();
      fetchCourts();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (courtId) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      try {
        await fetch(`/api/courts/${courtId}`, {
          method: "DELETE",
        });
        toast.success("Court deleted successfully");
        fetchCourts();
      } catch (error) {
        toast.error("Failed to delete court");
      }
    }
  };

  const handleStatusChange = async (courtId, newStatus) => {
    try {
      await fetch(`/api/courts/${courtId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success("Status updated successfully");
      fetchCourts();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "relative",
            height: "auto",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ overflow: "auto", p: 2 }}>
          <Typography variant="overline" sx={{ mb: 1 }}>
            ME
          </Typography>
          <List>
            <ListItem button>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="My Bookings" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="My Games" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="My Invoices" />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="overline" sx={{ mb: 1 }}>
            ACCOUNT SETTINGS
          </Typography>
          <List>
            <ListItem button>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary="Link Social Accounts" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary="Create Password" />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
            MORE ON COURTSITE
          </Typography>
          <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
            FOR BUSINESS
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="overline" sx={{ mb: 1 }}>
            SUPPORT
          </Typography>
          <List>
            <ListItem button>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help Centre" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
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
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                    >
                      Add New Court
                    </Button>
                    <Button variant="outlined" disabled>
                      Mark Selected Available
                    </Button>
                    <Button variant="outlined" disabled>
                      Mark Selected Maintenance
                    </Button>
                    <Button variant="outlined" color="error" disabled>
                      Delete Selected
                    </Button>
                  </Box>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox"></TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {courts
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((court) => (
                            <TableRow key={court.id}>
                              <TableCell padding="checkbox"></TableCell>
                              <TableCell>{court.name}</TableCell>
                              <TableCell>{court.description}</TableCell>
                              <TableCell>${court.price}/hour</TableCell>
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    handleStatusChange(
                                      court.id,
                                      court.status === "available"
                                        ? "maintenance"
                                        : "available"
                                    )
                                  }
                                >
                                  {court.status}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => handleOpenDialog(court)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDelete(court.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ textAlign: "center" }}>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50]}
                      component="div"
                      count={courts.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCourt ? "Edit Court" : "Add New Court"}
        </DialogTitle>
        <DialogContent sx={{ width: "100%" }}>
          <form onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              label="Court Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              label="Price per Hour"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              margin="normal"
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedCourt ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourtManagement;
