import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Business as VendorIcon } from '@mui/icons-material';

const VendorReorderView: React.FC = () => {
  return (
    <Box textAlign="center" py={8}>
      <Card sx={{ maxWidth: 400, mx: 'auto' }}>
        <CardContent>
          <VendorIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Vendor Reorder Planning Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Optimize vendor relationships with intelligent reorder planning, 
            automated purchase orders, and vendor performance tracking.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorReorderView;