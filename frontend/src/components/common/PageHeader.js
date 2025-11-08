import React from 'react';
import { Typography, Box, Divider } from '@mui/material';

const PageHeader = ({ title, subtitle }) => {
  return (
    <Box mb={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default PageHeader;
