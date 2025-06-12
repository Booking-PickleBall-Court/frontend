import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/Category";
import ImageIcon from "@mui/icons-material/Image";
import { toast } from "react-toastify";
import CourtFormDialog from "./CourtFormDialog";
import { courtAPI, authAPI } from "../services/api";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

const CourtManagement = () => {
  const [courts, setCourts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentUser, setCurrentUser] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchCourts();
    }
  }, [currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setCurrentUser(response.data);
    } catch (error) {
      toast.error("Failed to fetch user information");
    }
  };

  const fetchCourts = async () => {
    try {
      const response = await courtAPI.getCourtsByOwner(currentUser.id);
      console.log("Courts data:", response.data);
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

  const handleDelete = async (courtId) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      try {
        await courtAPI.deleteCourt(courtId);
        toast.success("Court deleted successfully");
        fetchCourts();
      } catch (error) {
        toast.error("Failed to delete court");
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "5vh",
          backgroundImage: 'url("/bg-home.avif")',
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            mt: 6,
            mb: 6,
            px: { xs: 2, sm: 3, md: 4 },
            width: "100%",
          }}
        >
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            <Grid item xs={12}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                      borderBottom: "2px solid #e0e0e0",
                      pb: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.primary.main,
                      }}
                    >
                      Court Management ({courts.length} total)
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      Add New Court
                    </Button>
                  </Box>

                  <TableContainer
                    component={Paper}
                    sx={{
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      width: "100%",
                      overflowX: "auto",
                    }}
                  >
                    <Table sx={{ minWidth: 1200 }}>
                      <TableHead>
                        <TableRow
                          sx={{ backgroundColor: theme.palette.primary.light }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "white",
                              minWidth: 150,
                              fontSize: "1.1rem",
                            }}
                          >
                            Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "white",
                              minWidth: 200,
                              fontSize: "1.1rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LocationOnIcon sx={{ fontSize: "1.3rem" }} />{" "}
                              Address
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "white",
                              minWidth: 250,
                              fontSize: "1.1rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <DescriptionIcon sx={{ fontSize: "1.3rem" }} />{" "}
                              Description
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "white",
                              minWidth: 120,
                              fontSize: "1.1rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <AttachMoneyIcon sx={{ fontSize: "1.3rem" }} />{" "}
                              Price
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "white",
                              minWidth: 120,
                              fontSize: "1.1rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <CategoryIcon sx={{ fontSize: "1.3rem" }} /> Type
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "white",
                              minWidth: 150,
                              fontSize: "1.1rem",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <ImageIcon sx={{ fontSize: "1.3rem" }} /> Image
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "white",
                              minWidth: 120,
                              fontSize: "1.1rem",
                            }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {courts
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((court) => (
                            <TableRow
                              key={court.id}
                              sx={{
                                "&:nth-of-type(odd)": {
                                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                                },
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  transition: "background-color 0.2s",
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  fontWeight: "medium",
                                  fontSize: "1.1rem",
                                }}
                              >
                                {court.name}
                              </TableCell>
                              <TableCell sx={{ fontSize: "1.1rem" }}>
                                {court.address}
                              </TableCell>
                              <TableCell
                                sx={{ maxWidth: 200, fontSize: "1.1rem" }}
                              >
                                {court.description}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "bold",
                                  color: theme.palette.primary.main,
                                  fontSize: "1.1rem",
                                }}
                              >
                                ${court.hourlyPrice}/hour
                              </TableCell>
                              <TableCell sx={{ fontSize: "1.1rem" }}>
                                {court.courtType}
                              </TableCell>
                              <TableCell>
                                <img
                                  src={
                                    court.imageUrls?.[0] || "/placeholder.jpg"
                                  }
                                  alt={court.name}
                                  style={{
                                    width: "120px",
                                    height: "70px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    transition: "transform 0.2s",
                                  }}
                                  onMouseOver={(e) =>
                                    (e.target.style.transform = "scale(1.05)")
                                  }
                                  onMouseOut={(e) =>
                                    (e.target.style.transform = "scale(1)")
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      color="primary"
                                      onClick={() => handleOpenDialog(court)}
                                      sx={{
                                        transition: "all 0.2s",
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.primary.light,
                                          transform: "scale(1.1)",
                                        },
                                      }}
                                    >
                                      <EditIcon sx={{ fontSize: "1.5rem" }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      color="error"
                                      onClick={() => handleDelete(court.id)}
                                      sx={{
                                        transition: "all 0.2s",
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.error.light,
                                          transform: "scale(1.1)",
                                        },
                                      }}
                                    >
                                      <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={courts.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      sx={{
                        borderTop: "1px solid #e0e0e0",
                        ".MuiTablePagination-select": {
                          borderRadius: 1,
                          fontSize: "1.1rem",
                        },
                        ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                          {
                            fontSize: "1.1rem",
                          },
                      }}
                    />
                  </TableContainer>
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
