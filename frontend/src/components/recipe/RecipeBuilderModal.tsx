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
import { Restaurant as RecipeIcon } from '@mui/icons-material';

interface RecipeBuilderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RecipeBuilderModal: React.FC<RecipeBuilderModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const handleSubmit = () => {
    // Mock success
    onSuccess();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Recipe Builder</DialogTitle>
      <DialogContent>
        <Box textAlign="center" py={4}>
          <RecipeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Recipe Builder Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Interactive recipe builder with drag-and-drop ingredients, 
            step-by-step instructions, cost calculations, and BOM generation.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create Recipe
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeBuilderModal;