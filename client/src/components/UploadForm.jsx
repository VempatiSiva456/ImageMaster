import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/joy";
import { useDropzone } from "react-dropzone";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const DropzoneComponent = ({ mode, onSuccess}) => {
  const [files, setFiles] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "info" });

  const handleUpload = async () => {
    if (!files.length) {
      if (!files.length) {
        setAlert({ message: "Please select images to upload.", type: "error" });
        return;
      }
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(
        `http://localhost:5000/api/images/upload?mode=${mode}`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload images.");
      }
      setAlert({ message: "Images uploaded successfully.", type: "success" });
      setFiles([]);
      onSuccess();
    } catch (error) {
      console.error("Error uploading images:", error.message);
      setAlert({
        message: "Error uploading images. Please try again.",
        type: "error",
      });
    }
  };

  const onDrop = (acceptedFiles) => {
    if (files.length + acceptedFiles.length > 10) {
      setAlert({
        message: "You can only upload up to 10 files only at a time.",
        type: "error",
      });
      return;
    }
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setAlert({ message: "", type: "info" });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <Box sx={{ p: 2 }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 2,
          border: "2px dashed",
          borderColor: "neutral.outlinedBorder",
          bgcolor: "background.body",
          color: "text.primary",
          borderRadius: 2,
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "background.level1",
            borderColor: "primary.outlinedHoverBorder",
          },
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body2" sx={{ mb: 2 }}>
          {isDragActive
            ? "Drop the images here ..."
            : files.length
            ? `Selected: ${files.map((file) => file.name).join(", ")}`
            : "Drag 'n' drop images here, or click to select images"}
        </Typography>
      </Box>
      <Button
        variant="outlined"
        onClick={handleUpload}
        disabled={!files.length}
        sx={{ mt: 2, width: "calc(100%)" }}
      >
        Upload
      </Button>
      {alert.message && (
        <Stack sx={{ width: "100%", mt: 2 }}>
          <Alert severity={alert.type}>{alert.message}</Alert>
        </Stack>
      )}
    </Box>
  );
};

export default DropzoneComponent;
