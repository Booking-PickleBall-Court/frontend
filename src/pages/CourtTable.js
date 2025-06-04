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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { courtAPI } from "../services/api"; 

const CourtTable = ({ courts, onEdit, onDeleteSuccess }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCourts.map((court) => (
              <TableRow key={court.id}>
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
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={courts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default CourtTable;
