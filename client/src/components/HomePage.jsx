import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  CardActionArea,
  useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#e3f2fd",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h5: {
      fontSize: "1.2rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 14px 0 rgba(0,0,0,0.10)",
          borderRadius: 12,
        },
      },
    },
  },
});

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const features = [];

export default function HomePage() {
  const navigate = useNavigate();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const handleGetStartedClick = () => {
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to ImageMaster
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            The ultimate tool for easy and efficient image annotation.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGetStartedClick}
          >
            Get Started
          </Button>
        </Box>
        <Grid container spacing={matches ? 4 : 2} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <FeatureCard variant="outlined">
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
