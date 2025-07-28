import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Restaurant as RecipeIcon } from '@mui/icons-material';

interface RecipesViewProps {
  onRefresh: () => void;
}

const RecipesView: React.FC<RecipesViewProps> = ({ onRefresh }) => {
  return (
    <Box textAlign="center" py={8}>
      <Card sx={{ maxWidth: 400, mx: 'auto' }}>
        <CardContent>
          <RecipeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Recipe Builder Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build comprehensive recipes with step-by-step instructions, ingredient lists, 
            cost analysis, and BOM management.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecipesView;