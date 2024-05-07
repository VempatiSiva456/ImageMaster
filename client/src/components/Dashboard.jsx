import React, { useState } from 'react';
import { Grid, Box, Button, Breadcrumbs, Typography, Modal, ModalDialog } from '@mui/joy';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import UploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import Dropzone from './UploadForm';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = ({mode}) => {
  console.log(mode);
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Breadcrumbs separator={<ChevronRightRoundedIcon />} aria-label="breadcrumb">
          <Button onClick={logout} startDecorator={<LogoutRoundedIcon />} variant="soft">
            Logout
          </Button>
        </Breadcrumbs>
        <Typography level="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
          Dashboard
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Button
              onClick={() => setOpen(true)}
              startDecorator={<UploadRoundedIcon />}
              variant="outlined"
            >
              Upload Image
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ModalDialog>
          <Dropzone mode={mode}/>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default Dashboard;
