import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  AppBar,
  Toolbar,
  Snackbar,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MuiAlert from "@mui/material/Alert";

const AddClasses = () => {
  const [domains, setDomains] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [newDomainName, setNewDomainName] = useState("");
  const [newDomainOnlyName, setNewDomainOnlyName] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchDomainsAndClasses();
  }, []);

  const fetchDomainsAndClasses = async () => {
    try {
      const domainResponse = await fetch(
        "http://localhost:5000/api/domain/getAll",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        }
      );
      const classResponse = await fetch(
        "http://localhost:5000/api/class/getAll",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        }
      );

      if (!domainResponse.ok || !classResponse.ok) {
        throw new Error("Failed to fetch resources");
      }

      const domainsData = await domainResponse.json();
      const classesData = await classResponse.json();

      const domainsWithClasses = domainsData.map((domain) => ({
        ...domain,
        classes: classesData.filter((cls) => cls.domain === domain._id),
      }));

      setDomains(domainsWithClasses);
    } catch (err) {
      console.error("Error fetching domains or classes", err);
      setError("Error fetching domains or classes");
    }
  };

  const addClass = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/class/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newClassName, domainName: newDomainName }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to add class");
      showAlert("Class added successfully", "success");
      fetchDomainsAndClasses();
      setNewClassName("");
      setNewDomainName("");
    } catch (err) {
      console.error("Error adding class:", err.message);
      showAlert("Error adding class", "error");
    }
  };

  const addDomain = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/domain/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newDomainOnlyName }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to add domain");
      showAlert("Domain added successfully", "success");
      fetchDomainsAndClasses();
      setNewDomainOnlyName("");
    } catch (err) {
      console.error("Error adding domain:", err.message);
      showAlert("Error adding domain", "error");
    }
  };

  const deleteDomain = async (domainId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/domain/delete/${domainId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to delete domain");
      showAlert("Domain deleted successfully", "success");
      fetchDomainsAndClasses();
    } catch (err) {
      console.error("Error deleting domain:", err.message);
      showAlert("Error deleting domain", "error");
    }
  };

  const deleteClass = async (classId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/class/delete/${classId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to delete class");
      showAlert("Class deleted successfully", "success");
      fetchDomainsAndClasses();
    } catch (err) {
      console.error("Error deleting class:", err.message);
      showAlert("Error deleting class", "error");
    }
  };

  const showAlert = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 1000);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <AppBar position="static" sx={{ backgroundColor: "blue" }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => navigate("/selectmode")}
            variant="contained"
            sx={{ marginRight: 1, backgroundColor: "white", color: "blue" }}
          >
            Back
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "white" }} align="center">
            Manage Classes and Domains
          </Typography>
          <Button
            onClick={logout}
            startIcon={<LogoutIcon sx={{color:"blue"}}/>}
            variant="contained"
            sx={{backgroundColor: "white", color: "blue"}}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box padding={3} component={Paper} elevation={3} sx={{ mt: 3 }} width={"60%"} alignSelf={"center"} display={"flex"} flexDirection={"column"}>
        <Typography variant="h5" gutterBottom sx={{ color: "#1976d2" }}>
          Add New Domain
        </Typography>
        <TextField
          fullWidth
          label="Domain Name"
          value={newDomainOnlyName}
          onChange={(e) => setNewDomainOnlyName(e.target.value)}
          margin="normal"
          variant="outlined"
          sx={{width: "40vh"}}
        />
        <Button
          onClick={addDomain}
          variant="contained"
          color="primary"
          disabled={!newDomainOnlyName}
          sx={{ mt: 2, backgroundColor: "#1976d2", color: "white", width:"20vh" }}
        >
          Add Domain
        </Button>
        <Typography variant="h5" gutterBottom sx={{ mt: 4, color: "#1976d2" }}>
          Add New Class
        </Typography>
        <TextField
          fullWidth
          label="Class Name"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          margin="normal"
          variant="outlined"
          sx={{width: "40vh"}}
        />
        <TextField
          fullWidth
          label="Domain Name"
          value={newDomainName}
          onChange={(e) => setNewDomainName(e.target.value)}
          margin="normal"
          variant="outlined"
          sx={{width: "40vh"}}
        />
        <Button
          onClick={addClass}
          variant="contained"
          color="primary"
          disabled={!newClassName || !newDomainName}
          sx={{ mt: 2, backgroundColor: "#1976d2", color: "white", width:"20vh" }}
        >
          Add Class
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        </Box>
        <Box padding={3} component={Paper} elevation={3} sx={{ mt: 3 }} width={"90%"} alignSelf={"center"} display={"flex"} flexDirection={"column"}>
        {domains.map((domain) => (
          <Box key={domain._id} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: "#1976d2" }}>
              {domain.name} ({domain.classes.length} Classes)
            </Typography>
            <List sx={{width: "80%"}}>
              {!domain.classes.length ? (
                <ListItem
                  divider
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#1976d2",
                    color: "white",
                  }}
                >
                  <ListItemText primary="Delete Domain"/>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteDomain(domain._id)}
                      disabled={domain.classes.length > 0}
                    >
                      <DeleteIcon sx={{ color: "white"}} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ) : (
                ""
              )}
              {domain.classes.map((cls) => (
                <ListItem
                  key={cls._id}
                  divider
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <ListItemText primary={cls.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="inherit"
                      onClick={() => deleteClass(cls._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
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
    </Box>
  );
};

export default AddClasses;
