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
  IconButton,
  Chip,
  Checkbox,
  Grid,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import UploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";
import Dropzone from "./UploadForm";
import { useAuth } from "../contexts/AuthContext";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

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
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [bulkClass, setBulkClass] = useState("");
  const [zoomLevels, setZoomLevels] = useState({});

  const navigate = useNavigate();
  const pageSize = 10;
  const { logout } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchClassesAndImagesAndUsers();
  }, [mode, statusFilter]);

  const fetchClassesAndImagesAndUsers = async () => {
    const classResponse = await fetchClasses();
    const imageResponse = await fetchImages();
    const { userResponse, current_user } = await fetchUsers();
    setClasses(classResponse);
    setImages(imageResponse);
    setUsers(userResponse);
    setCurrentUser(current_user);
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/class/getAll", {
        // headers: { Authorization: `Bearer ${localStorage.getItem("token_tool_user")}` },
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
        // headers: { Authorization: `Bearer ${localStorage.getItem("token_tool_user")}` },
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
          // headers: { Authorization: `Bearer ${localStorage.getItem("token_tool_user")}` },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch images");
      return await response.json();
    } catch (error) {
      console.error("Error fetching images:", error);
      showAlert("Start Uploading", "info");
      return [];
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleClassChange = (imageId, classId) => {
    setSelectedClasses((prev) => ({ ...prev, [imageId]: classId }));
  };

  const handleSelectImage = (imageId) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
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
            // Authorization: `Bearer ${localStorage.getItem("token_tool_user")}`,
          },
          body: JSON.stringify({ classId }),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to assign class");
      showAlert("Class assigned successfully", "success");
      const updatedImages = images.map((img) =>
        img._id === imageId
          ? {
              ...img,
              annotation: classId,
              status: "annotated",
              annotator: userId,
            }
          : img
      );
      setImages(updatedImages);
      setSelectedClasses((prev) => ({ ...prev, [imageId]: "" }));
      setEditMode((prev) => ({ ...prev, [imageId]: false }));
      setSelectedImages(
        new Set(Array.from(selectedImages).filter((id) => id !== imageId))
      );
    } catch (error) {
      console.error("Error assigning class:", error);
      showAlert("Error assigning class", "error");
    }
  };

  const removeClassAssignment = async (imageId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/images/removeClass/${imageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token_tool_user")}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to remove class assignment");
      showAlert("Class assignment removed successfully", "success");
      const updatedImages = images.map((img) =>
        img._id === imageId
          ? { ...img, annotation: null, annotator: null, status: "pending" }
          : img
      );
      setImages(updatedImages);
    } catch (error) {
      console.error("Error removing class assignment:", error);
      showAlert("Error removing class assignment", "error");
    }
  };

  const bulkAssignClass = async () => {
    if (!bulkClass) {
      showAlert(
        "Please select a class to assign to all selected images.",
        "error"
      );
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/images/updateBulkClass`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token_tool_user")}`,
          },
          body: JSON.stringify({
            imageIds: Array.from(selectedImages),
            classId: bulkClass,
          }),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to bulk assign class");
      showAlert("Class assigned to selected images successfully", "success");

      const updatedImages = images.map((img) =>
        selectedImages.has(img._id)
          ? {
              ...img,
              annotation: bulkClass,
              status: "annotated",
              annotator: currentUser,
            }
          : img
      );
      setImages(updatedImages);
      setSelectedClasses({});
      setSelectedImages(new Set());
    } catch (error) {
      console.error("Error bulk assigning class:", error);
      showAlert("Error bulk assigning class", "error");
    }
  };

  const handleUploadSuccess = async () => {
    const imageData = await fetchImages();
    setImages(imageData);
  };

  const deleteImages = async() => {
    if (selectedImages.size === 0) {
      showAlert("No images selected for deletion", "warning");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/images/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token_tool_user")}`,
          },
          body: JSON.stringify({
            imageIds: Array.from(selectedImages),
          }),
          credentials: "include",
        }
      );
      if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to delete images");
    }

    const { deletedCount } = await response.json();
    showAlert(`${deletedCount} images deleted successfully`, "success");

    const updatedImages = images.filter(img => !selectedImages.has(img._id));
    setImages(updatedImages);
    setSelectedImages(new Set());

  } catch (error) {
    console.error("Error deleting images:", error);
    showAlert("Error deleting images", "error");
  }
  };

  const downloadAnnotatedImagesInfo = () => {
    const annotatedImages = images.filter((img) => img.status === "annotated");
    if (!annotatedImages.length) {
      showAlert("No images are annotated yet", "error");
    } else {
      const content = annotatedImages
        .map((img) => {
          const className =
            classes.find((cls) => cls._id === img.annotation)?.name ||
            "No Class Found";
          return `${img.filename.substring(
            mode === "public" ? 44 : 45
          )} - ${className}`;
        })
        .join("\n");
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "annotated-images-info.txt";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showAlert("Annotations Downloaded Successfully", "success");
    }
  };

  const adjustZoom = (imageId, adjustment) => {
    setZoomLevels(prev => ({
      ...prev,
      [imageId]: (prev[imageId] || 100) + adjustment
    }));
  };

  const showAlert = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 1000);
  };

  const getStatusChip = (status) => {
    if (status === "annotated") {
      return <Chip label="Annotated" color="success" />;
    } else if (status === "pending") {
      return <Chip label="Pending" color="warning" />;
    }
    return <Chip label={status} />;
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
            startIcon={<ArrowBackIosNewRoundedIcon sx={{ color: "primary.main" }} />}
            onClick={() => navigate("/selectmode")}
            variant="contained"
            sx={{ marginRight: 1, backgroundColor: "white", color: "primary.main" }}
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
            startIcon={<LogoutRoundedIcon sx={{ color: "primary.main" }} />}
            variant="contained"
            sx={{ backgroundColor: "white", color: "primary.main" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h4" sx={{ mt: 2, mb: 1, color: "#1976d2" }}>
          Image Management
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Button
              onClick={() => setOpen(true)}
              startIcon={<UploadRoundedIcon />}
              variant="contained"
              color="primary"
            >
              Upload Image
            </Button>
          </Grid>
          <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
            {images.some((img) => img.status === "annotated") && (
              <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={downloadAnnotatedImagesInfo}
                sx={{ mr: 2 }}
                startIcon={<DownloadIcon />}
              >
                Download
              </Button>
              </Box>
            )}
            <TextField
              label="Search by Class Name"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: isMobile ? "100%" : "auto", flexGrow: 1, mr: 2 }}
            />
            <Box display="flex" alignItems="center">
              <Select
                value={bulkClass}
                onChange={(e) => setBulkClass(e.target.value)}
                displayEmpty
                sx={{ width: 200, mr: 2 }}
              >
                <MenuItem value="">
                  <em>Select Class for Bulk</em>
                </MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                color="primary"
                onClick={bulkAssignClass}
                disabled={selectedImages.size === 0 || !bulkClass}
              >
                Assign
              </Button>
            </Box>
            <Box display="flex" alignItems="center">
            <Button
                variant="contained"
                color="primary"
                onClick={deleteImages}
                disabled={selectedImages.size === 0}
                sx = {{ml: 1}}
              >
                Delete
              </Button>
              </Box>
          </Grid>
        </Grid>
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Status Filter</FormLabel>
          <RadioGroup
            row
            aria-label="status"
            name="row-radio-buttons-group"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="pending" control={<Radio />} label="Pending" />
            <FormControlLabel value="annotated" control={<Radio />} label="Annotated" />
          </RadioGroup>
        </FormControl>
        <TableContainer
          component={Paper}
          sx={{ border: 1, borderColor: "divider", mt: 2 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell
                  align="center"
                  style={{ color: "white", width: "3%" }}
                >
                  <Checkbox
                    indeterminate={
                      selectedImages.size > 0 &&
                      selectedImages.size < currentImages.length
                    }
                    checked={
                      selectedImages.size > 0
                      // currentImages.length > 0 &&
                      // selectedImages.size === currentImages.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newSelectedImages = new Set(
                          currentImages
                            .filter((img) => img.status === "pending")
                            .map((img) => img._id)
                        );
                        setSelectedImages(newSelectedImages);
                      } else {
                        setSelectedImages(new Set());
                      }
                    }}
                    color="default"
                  />
                </TableCell>
                <TableCell align="left" style={{ color: "white", width: "2%" }}>
                  S.No.
                </TableCell>
                <TableCell
                  align="left"
                  style={{ color: "white", width: "20%" }}
                >
                  File Name
                </TableCell>
                <TableCell
                  align="left"
                  style={{ color: "white", width: "15%" }}
                >
                  Image
                </TableCell>
                <TableCell align="left" style={{ color: "white", width: "8%" }}>
                  Status
                </TableCell>
                <TableCell
                  align="left"
                  style={{ color: "white", width: "25%" }}
                >
                  Annotation
                </TableCell>
                {mode === "public" ? (
                  <TableCell
                    align="left"
                    style={{ color: "white", width: "15%" }}
                  >
                    Annotator
                  </TableCell>
                ) : (
                  ""
                )}
                <TableCell
                  align="left"
                  style={{ color: "white", width: "12%" }}
                >
                  Assign
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentImages.map((img, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedImages.has(img._id)}
                      onChange={() => handleSelectImage(img._id)}
                      disabled={img.status !== "pending"}
                    />
                  </TableCell>
                  <TableCell>
                    {1 + index + (currentPage - 1) * pageSize}
                  </TableCell>
                  <TableCell>
                    {img.filename.substring(mode === "public" ? 44 : 45)}
                  </TableCell>
                  <TableCell>
                  <Box display="flex" alignItems="center" justifyContent="center">
                      <IconButton
                        aria-label="zoom-out"
                        onClick={() => adjustZoom(img._id, -10)}
                        size="small"
                      >
                        <ZoomOutIcon fontSize="small" />
                      </IconButton>
                      <img
                        src={img.imageUrl}
                        alt={img.filename.substring(mode === "public" ? 44 : 45)}
                        style={{
                          width: `${zoomLevels[img._id] || 100}px`,
                          height: "auto",
                          transition: "width 0.3s",
                        }}
                      />
                      <IconButton
                        aria-label="zoom-in"
                        onClick={() => adjustZoom(img._id, 10)}
                        size="small"
                      >
                        <ZoomInIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{getStatusChip(img.status)}</TableCell>
                  <TableCell>
                    {img.status === "annotated" && !editMode[img._id] ? (
                      <>
                        {classes.find((cls) => cls._id === img.annotation)
                          ?.name || "Class not found"}
                        {img.annotator === currentUser && (
                          <>
                            <IconButton
                              aria-label="edit"
                              onClick={() =>
                                setEditMode({ ...editMode, [img._id]: true })
                              }
                            >
                              <EditIcon sx={{ ml: 1, color: "primary.main" }} />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => removeClassAssignment(img._id)}
                            >
                              <DeleteIcon sx={{ ml: 1, color: "black" }} />
                            </IconButton>
                          </>
                        )}
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
                        <MenuItem value="" sx={{ color: "grey" }}>
                          Select Class
                        </MenuItem>
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
                      sx={{ ml: 1, height: "30px", width: "15vh" }}
                    >
                      Assign
                    </Button>
                    {editMode[img._id] && (
                      <IconButton
                        aria-label="cancel"
                        onClick={() => {
                          setEditMode({ ...editMode, [img._id]: false });
                          setSelectedClasses({
                            ...selectedClasses,
                            [img._id]: "",
                          });
                        }}
                      >
                        <CancelIcon sx={{ ml: 1, color: "black" }} />
                      </IconButton>
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
