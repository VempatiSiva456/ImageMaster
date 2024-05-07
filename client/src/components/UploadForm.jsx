import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/joy';
import { useDropzone } from 'react-dropzone';

const DropzoneComponent = ({ mode }) => {
    const [files, setFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    console.log(mode);

    const handleUpload = async () => {
        if (!files.length) {
            setErrorMessage('Please select images to upload.');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await fetch(`http://localhost:5000/api/images/upload?mode=${mode}`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                credentials: "include"
            });
            console.log(response);

            if (!response.ok) {
                throw new Error('Failed to upload images.');
            }
            console.log('Images uploaded successfully.');
            setFiles([]);
            setErrorMessage('');
        } catch (error) {
            console.error('Error uploading images:', error.message);
            setErrorMessage('Error uploading images. Please try again.');
        }
    };

    const onDrop = (acceptedFiles) => {
        if (files.length + acceptedFiles.length > 10) {
            setErrorMessage('You can only upload up to 10 files.');
            return;
        }
        setFiles(prev => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true
    });

    return (
        <Box sx={{ p: 2 }}>
            <Box
                {...getRootProps()}
                sx={{
                    p: 2,
                    border: '2px dashed',
                    borderColor: 'neutral.outlinedBorder',
                    bgcolor: 'background.body',
                    color: 'text.primary',
                    borderRadius: 2,
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: 'background.level1',
                        borderColor: 'primary.outlinedHoverBorder'
                    }
                }}
            >
                <input {...getInputProps()} />
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {isDragActive ? "Drop the images here ..." : files.length ? `Selected: ${files.map(file => file.name).join(', ')}` : "Drag 'n' drop images here, or click to select images"}
                </Typography>
            </Box>
            <Button variant="outlined" onClick={handleUpload} disabled={!files.length} sx={{ mt: 2, width: 'calc(100%)' }}>
                Upload
            </Button>
            {errorMessage && <Typography variant="body3" sx={{ color: 'danger.fg', mt: 2 }}>{errorMessage}</Typography>}
        </Box>
    );
};

export default DropzoneComponent;
