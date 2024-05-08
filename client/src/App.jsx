import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./components/LoginForm";
import SignUp from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import SelectMode from "./components/SelectMode";
import AddClasses from "./components/AddClasses";
import { CssBaseline, Box } from '@mui/material';

function App() {
  return (
    <>
    <CssBaseline />
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh' }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route
          path="/selectmode"
          element={
            <ProtectedRoute>
              <SelectMode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/public-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard mode={"public"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/private-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard mode={"private"} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-classes"
          element={
            <ProtectedRoute>
              <AddClasses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
    </Box>
    </>
  );
}

export default App;
