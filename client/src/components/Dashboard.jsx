import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Modal,
  TableHead,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Pagination from "@mui/material/Pagination";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import UploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import Dropzone from "./UploadForm";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { logout } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/images/get?mode=${mode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      }
    };

    fetchImages();
  }, [mode]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const currentImages = images.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Breadcrumbs
            separator={<ChevronRightRoundedIcon />}
            aria-label="breadcrumb"
          >
            <Typography color="text.primary">
              {mode === "public" ? "Public" : "Private"} Dashboard
            </Typography>
          </Breadcrumbs>
          <Button
            onClick={logout}
            startIcon={<LogoutRoundedIcon />}
            variant="contained"
          >
            Logout
          </Button>
        </Box>
        <Typography variant="h4" sx={{ mt: 2, mb: 1 }}>
          Image Management
        </Typography>
        <Button
          onClick={() => setOpen(true)}
          startIcon={<UploadRoundedIcon />}
          variant="contained"
          sx={{ mb: 2 }}
        >
          Upload Image
        </Button>
        <TableContainer
          component={Paper}
          sx={{ border: 1, borderColor: "divider" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "primary.dark" }}>
              <TableRow>
                <TableCell align="left" style={{ color: "white" }}>
                  S.No.
                </TableCell>
                <TableCell align="left" style={{ color: "white" }}>
                  File Name
                </TableCell>
                <TableCell align="left" style={{ color: "white" }}>
                  Image
                </TableCell>
                <TableCell align="left" style={{ color: "white" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentImages.map((img, index) => (
                <TableRow key={index}>
                  <TableCell align="left">
                    {1 + index + (currentPage - 1) * pageSize}
                  </TableCell>
                  <TableCell align="left">
                    {img.filename.substring(mode === "public" ? 44 : 45)}
                  </TableCell>
                  <TableCell align="left">
                    <img
                      src={img.imageUrl}
                      alt={img.filename.substring(44)}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </TableCell>
                  <TableCell align="left">{img.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(images.length / pageSize)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Dropzone mode={mode} />
      </Modal>
    </Box>
  );
};

export default Dashboard;
