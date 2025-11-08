import React from 'react';
import { Grid, Skeleton } from '@mui/material';

const CourseCardSkeleton = () => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Skeleton variant="rectangular" height={140} />
      <Skeleton />
      <Skeleton width="60%" />
    </Grid>
  );
};

export default CourseCardSkeleton;
