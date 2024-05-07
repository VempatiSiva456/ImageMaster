import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid } from "@mui/joy";

const SelectMode = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Grid container sx={{margin:"40vh"}}>
        <Grid item xs={12} sm={12} md={6}>
          <Button onClick={() => navigate("/public-dashboard")}>
            Join Public
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Button onClick={() => navigate("/private-dashboard")}>
            Join Private
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SelectMode;
