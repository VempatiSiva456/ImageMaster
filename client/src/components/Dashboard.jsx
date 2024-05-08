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
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import UploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";
import Dropzone from "./UploadForm";
import { useAuth } from "../contexts/AuthContext";
import MuiAlert from "@mui/material/Alert";

const Dashboard = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedClasses, setSelectedClasses] = useState({});
  const [editMode, setEditMode] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const navigate = useNavigate();
  const pageSize = 10;
  const { logout } = useAuth();

  useEffect(() => {
    fetchClassesAndImagesAndUsers();
  }, [mode, statusFilter]);

  const fetchClassesAndImagesAndUsers = async () => {
    const classResponse = await fetchClasses();
    const imageResponse = await fetchImages();
    const {userResponse, current_user} = await fetchUsers();
    setClasses(classResponse);
    setImages(imageResponse);
    setUsers(userResponse);
    setCurrentUser(current_user);
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/class/getAll", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching classes:", error);
      showAlert("Failed to fetch classes", "error");
      return [];
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/getAll", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert("Failed to fetch users", "error");
      return [];
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/images/get?mode=${mode}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch images");
      return await response.json();
    } catch (error) {
      console.error("Error fetching images:", error);
      showAlert("Failed to fetch images", "error");
      return [];
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleClassChange = (imageId, classId) => {
    setSelectedClasses((prev) => ({ ...prev, [imageId]: classId }));
  };

  const submitClassAssignment = async (imageId, classId, userId) => {
    if (!classId) {
      showAlert("Please select a class to assign.", "error");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/images/updateClass/${imageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ classId }),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to assign class");
      showAlert("Class assigned successfully", "success");
      const updatedImages = images.map((img) =>
        img._id === imageId
          ? { ...img, annotation: classId, status: "annotated", annotator: userId }
          : img
      );
      setImages(updatedImages);
      setSelectedClasses((prev) => ({ ...prev, [imageId]: "" }));
      setEditMode((prev) => ({ ...prev, [imageId]: false }));
    } catch (error) {
      console.error("Error assigning class:", error);
      showAlert("Error assigning class", "error");
    }
  };

  const handleUploadSuccess = async () => {
    const imageData = await fetchImages();
    setImages(imageData);
  };

  const showAlert = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 1000);
  };

  const filteredImages = images.filter((img) => {
    const classMatch = classes
      .find((cls) => cls._id === img.annotation)
      ?.name?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || img.status === statusFilter;
    return searchTerm === "" ? statusMatch : classMatch && statusMatch;
  });

  const currentImages = filteredImages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <AppBar position="static" sx={{ backgroundColor: "primary" }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBackIosNewRoundedIcon sx={{ color: "blue" }} />}
            onClick={() => navigate("/selectmode")}
            variant="contained"
            sx={{ marginRight: 1, backgroundColor: "white", color: "blue" }}
          >
            Back
          </Button>
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, color: "white" }}
            align="center"
          >
            {mode === "public" ? "Public" : "Private"} Dashboard
          </Typography>
          <Button
            onClick={logout}
            startIcon={<LogoutRoundedIcon sx={{ color: "blue" }} />}
            variant="contained"
            sx={{ backgroundColor: "white", color: "blue" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h4" sx={{ mt: 2, mb: 1, color: "#1976d2" }}>
          Image Management
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Button
            onClick={() => setOpen(true)}
            startIcon={<UploadRoundedIcon />}
            variant="contained"
            color="primary"
          >
            Upload Image
          </Button>
          <TextField
            label="Search by Class Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "25%" }}
          />
        </Box>
        <FormControl component="fieldset">
          <FormLabel component="legend">Status Filter</FormLabel>
          <RadioGroup
            row
            aria-label="status"
            name="row-radio-buttons-group"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel
              value="pending"
              control={<Radio />}
              label="Pending"
            />
            <FormControlLabel
              value="annotated"
              control={<Radio />}
              label="Annotated"
            />
          </RadioGroup>
        </FormControl>
        <TableContainer
          component={Paper}
          sx={{ border: 1, borderColor: "divider", mt: 2 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
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
                <TableCell align="left" style={{ color: "white" }}>
                  Annotation
                </TableCell>
                {mode === "public" ? (
                  <TableCell align="left" style={{ color: "white" }}>
                    Annotator
                  </TableCell>
                ) : (
                  ""
                )}
                <TableCell align="left" style={{ color: "white" }}>
                  Assign
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentImages.map((img, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {1 + index + (currentPage - 1) * pageSize}
                  </TableCell>
                  <TableCell>
                    {img.filename.substring(mode === "public" ? 44 : 45)}
                  </TableCell>
                  <TableCell>
                    <img
                      src={img.imageUrl}
                      alt={img.filename.substring(44)}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </TableCell>
                  <TableCell>{img.status}</TableCell>
                  <TableCell>
                    {img.status === "annotated" && !editMode[img._id] ? (
                      <>
                        {classes.find((cls) => cls._id === img.annotation)
                          ?.name || "Class not found"}
                        <Button
                          variant="outlined"
                          onClick={() =>
                            setEditMode({ ...editMode, [img._id]: true })
                          }
                          sx={{ ml: 1, height: "30px", width: "15vh"}}
                        >
                          Change
                        </Button>
                      </>
                    ) : (
                      <Select
                        value={selectedClasses[img._id] || ""}
                        onChange={(e) =>
                          handleClassChange(img._id, e.target.value)
                        }
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        sx={{
                          width: "50%",
                          ".MuiSelect-select": {
                            bgcolor: "white",
                            color: "#1976d2",
                            fontSize: "1.2rem",
                            height: "2.5rem",
                            padding: "5px 10px",
                          },
                        }}
                      >
                        <MenuItem value="">Select Class</MenuItem>
                        {classes.map((cls) => (
                          <MenuItem key={cls._id} value={cls._id}>
                            {cls.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </TableCell>
                  {mode === "public" ? (
                    <>
                      <TableCell align="left" style={{ color: "black" }}>
                        {img.status === "annotated"
                          ? users.find((u) => u._id === img.annotator)?.name
                          : ""}
                      </TableCell>
                    </>
                  ) : (
                    ""
                  )}
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => {
                        submitClassAssignment(
                          img._id,
                          selectedClasses[img._id],
                          currentUser
                        );
                        setEditMode({ ...editMode, [img._id]: false });
                      }}
                      disabled={!selectedClasses[img._id]}
                      sx={{ ml: 1, height: "30px", width: "15vh"}}
                    >
                      Assign
                    </Button>
                    {editMode[img._id] && (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditMode({ ...editMode, [img._id]: false });
                          setSelectedClasses({
                            ...selectedClasses,
                            [img._id]: "",
                          });
                        }}
                        sx={{ ml: 1, height: "30px", width: "15vh"}}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(filteredImages.length / pageSize)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      </Box>
      {snackbarMessage && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={1000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert elevation={6} variant="filled" severity={snackbarType}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div>
          <Dropzone mode={mode} onSuccess={handleUploadSuccess} />
        </div>
      </Modal>
    </Box>
  );
};

export default Dashboard;
