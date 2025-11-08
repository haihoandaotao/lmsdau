import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';

const Assignments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: '',
    status: ''
  });

  useEffect(() => {
    fetchAssignments();
    if (user.role === 'student') {
      fetchEnrolledCourses();
    }
  }, [filters]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const { data } = await api.get('/assignments', { params });
      setAssignments(data.data);
    } catch (error) {
      toast.error('Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await api.get('/courses/enrolled');
      setCourses(data.data);
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getStatusColor = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'error';
    if (diffDays <= 3) return 'warning';
    return 'success';
  };

  const getStatusText = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Quá hạn';
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    return `Còn ${diffDays} ngày`;
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Bài tập"
        subtitle="Quản lý và nộp bài tập của bạn"
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        {user.role === 'student' && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Khóa học</InputLabel>
            <Select
              name="course"
              value={filters.course}
              label="Khóa học"
              onChange={handleFilterChange}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            name="status"
            value={filters.status}
            label="Trạng thái"
            onChange={handleFilterChange}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="pending">Chưa nộp</MenuItem>
            <MenuItem value="submitted">Đã nộp</MenuItem>
            <MenuItem value="graded">Đã chấm</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="rectangular" height={36} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : assignments.length > 0 ? (
          assignments.map((assignment) => (
            <Grid item key={assignment._id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {assignment.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {assignment.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<SchoolIcon />}
                      label={assignment.course?.title}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<CalendarIcon />}
                      label={getStatusText(assignment.dueDate)}
                      size="small"
                      color={getStatusColor(assignment.dueDate)}
                    />
                  </Box>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/assignments/${assignment._id}`)}
                  >
                    {user.role === 'student' ? 'Xem & Nộp bài' : 'Xem chi tiết'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">
              {user.role === 'student'
                ? 'Bạn chưa có bài tập nào.'
                : 'Chưa có bài tập nào được tạo.'
              }
            </Alert>
          </Grid>
        )}
      </Grid>

      {user.role === 'teacher' && (
        <Fab
          color="primary"
          aria-label="add assignment"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => navigate('/assignments/create')}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default Assignments;
