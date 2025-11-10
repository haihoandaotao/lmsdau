import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Skeleton,
  Alert
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourseDetail();
    fetchAssignments();
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data.data);
    } catch (error) {
      setError('Không thể tải thông tin khóa học');
      toast.error('Không thể tải thông tin khóa học');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get(`/assignments?course=${id}`);
      setAssignments(data.data);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success('Đăng ký khóa học thành công!');
      await refreshUser(); // Refresh user data to update enrolledCourses
      fetchCourseDetail(); // Refresh course data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const handleUnenroll = async () => {
    try {
      await api.post(`/courses/${id}/unenroll`);
      toast.success('Hủy đăng ký thành công!');
      await refreshUser(); // Refresh user data
      fetchCourseDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hủy đăng ký thất bại');
    }
  };

  const isEnrolled = () => {
    return user?.enrolledCourses?.some(c => {
      // Handle both object format {_id, title, ...} and string format
      const courseId = typeof c === 'object' ? c._id : c;
      return courseId === id;
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="text" height={60} />
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="text" height={40} />
        <Skeleton variant="rectangular" height={300} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">Không tìm thấy khóa học</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={course.title}
        subtitle={`Mã học phần: ${course.code}`}
      />

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Course Info Card */}
          <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Thông tin học phần
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Mã học phần</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{course.code}</Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Số tín chỉ</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{course.credits || 3} tín chỉ</Typography>
                </Grid>
                {course.major && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Ngành đào tạo</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{course.major.name || course.major.code}</Typography>
                  </Grid>
                )}
                {course.academicYear && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Năm học</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Năm {course.academicYear}</Typography>
                  </Grid>
                )}
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Học kỳ</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {course.semester === 'Summer' ? 'Học kỳ Hè' : `Học kỳ ${course.semester}`}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Năm học</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{course.year}</Typography>
                </Grid>
                {course.category && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Loại học phần</Typography>
                    <Chip 
                      label={course.category} 
                      size="small" 
                      sx={{ mt: 0.5, bgcolor: 'white', color: 'primary.main', fontWeight: 'bold' }}
                    />
                  </Grid>
                )}
                {course.courseType && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Tính chất</Typography>
                    <Chip 
                      label={course.courseType} 
                      size="small"
                      color={course.courseType === 'Bắt buộc' ? 'error' : 'default'}
                      sx={{ mt: 0.5, bgcolor: 'white', fontWeight: 'bold' }}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mô tả khóa học
              </Typography>
              <Typography variant="body1" paragraph>
                {course.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Chip icon={<PersonIcon />} label={`GV: ${course.instructor?.name}`} />
                <Chip icon={<CalendarIcon />} label={`${course.semester === 'Summer' ? 'Hè' : 'HK' + course.semester} ${course.year}`} />
              </Box>

              {user.role === 'student' && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  {isEnrolled() ? (
                    <>
                      <Button 
                        variant="contained" 
                        color="primary"
                        startIcon={<PersonIcon />}
                        onClick={() => navigate(`/courses/${id}/learn`)}
                        sx={{ flexGrow: 1 }}
                      >
                        Học ngay
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={handleUnenroll}>
                        Hủy đăng ký
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" onClick={handleEnroll} sx={{ flexGrow: 1 }}>
                      Đăng ký khóa học
                    </Button>
                  )}
                </Box>
              )}

              {(user.role === 'teacher' || user.role === 'admin') && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate(`/courses/${id}/modules`)}
                      sx={{ flexGrow: 1 }}
                    >
                      Quản lý nội dung
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={() => navigate(`/courses/${id}/gradebook`)}
                      sx={{ flexGrow: 1 }}
                    >
                      Bảng điểm
                    </Button>
                  </Box>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => navigate(`/courses/${id}/settings`)}
                    fullWidth
                  >
                    Cài đặt khóa học
                  </Button>
                </Box>
              )}

              {user.role === 'student' && isEnrolled() && (
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => navigate(`/courses/${id}/my-grades`)}
                    fullWidth
                  >
                    Xem điểm của tôi
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                Bài tập ({assignments.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {assignments.length > 0 ? (
                <List>
                  {assignments.map((assignment) => (
                    <ListItem
                      key={assignment._id}
                      button
                      onClick={() => navigate(`/assignments/${assignment._id}`)}
                      sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
                    >
                      <ListItemIcon>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={assignment.title}
                        secondary={`Hạn nộp: ${new Date(assignment.dueDate).toLocaleDateString('vi-VN')}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  Chưa có bài tập nào được giao.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin giảng viên
              </Typography>
              <Typography variant="body2">
                <strong>Tên:</strong> {course.instructor?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {course.instructor?.email}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê
              </Typography>
              <Typography variant="body2">
                Số bài tập: {assignments.length}
              </Typography>
              <Typography variant="body2">
                Học kỳ: {course.semester} {course.year}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail;
