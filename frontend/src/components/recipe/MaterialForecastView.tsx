import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';

const MaterialForecastView: React.FC = () => {
  return (
    <Box textAlign="center" py={8}>
      <Card sx={{ maxWidth: 400, mx: 'auto' }}>
        <CardContent>
          <AnalyticsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Material Forecast Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Predict raw material consumption based on sales projections, 
            seasonal trends, and historical usage patterns.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MaterialForecastView;