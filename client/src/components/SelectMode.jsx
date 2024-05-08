import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Box } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuth } from "../contexts/AuthContext";

const SelectMode = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
        <Button
          startIcon={<LogoutRoundedIcon />}
          onClick={logout}
          variant="contained"
        >
          Logout
        </Button>
      </Box>
      <Grid container spacing={2} padding={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <Button
            onClick={() => navigate("/public-dashboard")}
            variant="contained"
            fullWidth
          >
            Join Public
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            onClick={() => navigate("/private-dashboard")}
            variant="contained"
            fullWidth
          >
            Join Private
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            onClick={() => navigate("/create-classes")}
            variant="contained"
            fullWidth
          >
            Create Classes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SelectMode;
