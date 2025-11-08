import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, onEnroll, onUnenroll, isEnrolled }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {course.description}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label={course.code} size="small" sx={{ mr: 1 }} />
          <Chip label={`${course.credits} tín chỉ`} size="small" />
        </Box>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          GV: {course.instructor?.name}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate(`/courses/${course._id}`)}
        >
          Xem chi tiết
        </Button>
        {isEnrolled !== undefined && (
          <Button
            fullWidth
            variant="contained"
            color={isEnrolled ? 'secondary' : 'primary'}
            onClick={() => isEnrolled ? onUnenroll(course._id) : onEnroll(course._id)}
            sx={{ mt: 1 }}
          >
            {isEnrolled ? 'Hủy đăng ký' : 'Đăng ký'}
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default CourseCard;
