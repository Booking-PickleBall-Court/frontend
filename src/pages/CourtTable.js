import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Box,
  Container,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { courtAPI } from "../services/api";

const CourtTable = ({ courts, onEdit, onDeleteSuccess }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const handleDelete = async (courtId) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      try {
        await courtAPI.deleteCourt(courtId);
        toast.success("Court deleted successfully");
        onDeleteSuccess();
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

  const paginatedCourts = courts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={
        {
          // Removed background and centering styles
        }
      }
    >
      <Container maxWidth="lg">
        <Paper
          elevation={4}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 2,
            overflow: "hidden",
            p: 2,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "rgba(224, 224, 224, 0.8)" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCourts.map((court) => (
                  <TableRow
                    key={court.id}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <TableCell>{court.name}</TableCell>
                    <TableCell>{court.address}</TableCell>
                    <TableCell>{court.description}</TableCell>
                    <TableCell>${court.hourlyPrice}/hour</TableCell>
                    <TableCell>{court.courtType}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onEdit(court)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(court.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[6]}
            component="div"
            count={courts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default CourtTable;
