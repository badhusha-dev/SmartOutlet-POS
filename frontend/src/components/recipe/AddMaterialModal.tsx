import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Inventory2 as MaterialIcon } from '@mui/icons-material';

interface AddMaterialModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const handleSubmit = () => {
    // Mock success
    onSuccess();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Raw Material</DialogTitle>
      <DialogContent>
        <Box textAlign="center" py={4}>
          <MaterialIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Material Form Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive form for adding raw materials with UOM, expiry tracking, 
            vendor information, and cost details.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add Material
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMaterialModal;