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
  Container,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AddClasses = () => {
  const [domains, setDomains] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [newDomainName, setNewDomainName] = useState("");
  const [newDomainOnlyName, setNewDomainOnlyName] = useState("");
  const [error, setError] = useState("");

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
      fetchDomainsAndClasses();
      setNewClassName("");
      setNewDomainName("");
    } catch (err) {
      console.error("Error adding class:", err.message);
      setError(err.message);
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
      fetchDomainsAndClasses();
      setNewDomainOnlyName("");
    } catch (err) {
      console.error("Error adding domain:", err.message);
      setError(err.message);
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
      fetchDomainsAndClasses();
    } catch (err) {
      console.error("Error deleting domain:", err.message);
      setError(err.message);
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
      fetchDomainsAndClasses();
    } catch (err) {
      console.error("Error deleting class:", err.message);
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box padding={3} component={Paper}>
        <Typography variant="h4" gutterBottom>
          Manage Domains
        </Typography>
        <Box component="form" onSubmit={(e) => e.preventDefault()} marginY={2}>
          <TextField
            fullWidth
            label="New Domain Name"
            value={newDomainOnlyName}
            onChange={(e) => setNewDomainOnlyName(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Button
            onClick={addDomain}
            variant="contained"
            color="primary"
            disabled={!newDomainOnlyName}
            sx={{ mt: 2 }}
          >
            Add Domain
          </Button>
        </Box>
        <Typography variant="h4" gutterBottom>
          Manage Classes
        </Typography>
        <Box component="form" onSubmit={(e) => e.preventDefault()} marginY={2}>
          <TextField
            fullWidth
            label="New Class Name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Domain Name"
            value={newDomainName}
            onChange={(e) => setNewDomainName(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Button
            onClick={addClass}
            variant="contained"
            color="primary"
            disabled={!newClassName || !newDomainName}
            sx={{ mt: 2 }}
          >
            Add Class
          </Button>
        </Box>
        {error && <Typography color="error">{error}</Typography>}
        {domains.map((domain) => (
          <Box
            key={domain._id}
            marginBottom={2}
            component={Paper}
            padding={2}
            mt={2}
          >
            <Typography variant="h6">{domain.name}</Typography>
            <List>
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
                      onClick={() => deleteClass(cls._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              <ListItem
                divider
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText primary="Delete Domain" />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteDomain(domain._id)}
                    disabled={domain.classes.length > 0}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default AddClasses;
