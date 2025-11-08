import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import CourseCard from '../components/CourseCard';
import CourseCardSkeleton from '../components/CourseCardSkeleton';
import { useDebounce } from '../hooks/useDebounce'; // Sẽ tạo hook này

const Courses = () => {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    semester: '',
    year: ''
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: debouncedSearch,
      };
      // Remove empty filters
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== '')
      );

      const { data } = await api.get('/courses', { params: cleanParams });
      setCourses(data.data);
    } catch (error) {
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  }, [filters.semester, filters.year, debouncedSearch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      toast.success('Đăng ký khóa học thành công!');
      await refreshUser(); // Cập nhật context
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/unenroll`);
      toast.success('Hủy đăng ký thành công!');
      await refreshUser(); // Cập nhật context
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hủy đăng ký thất bại');
    }
  };

  const isEnrolled = (course) => {
    return user?.enrolledCourses?.some(c => c === course._id);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Danh sách Khóa học
      </Typography>

      <Box component="div" sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          name="search"
          label="Tìm kiếm khóa học"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Học kỳ</InputLabel>
          <Select
            name="semester"
            value={filters.semester}
            label="Học kỳ"
            onChange={handleFilterChange}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="1">Học kỳ 1</MenuItem>
            <MenuItem value="2">Học kỳ 2</MenuItem>
            <MenuItem value="Hè">Học kỳ Hè</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Năm học</InputLabel>
          <Select
            name="year"
            value={filters.year}
            label="Năm học"
            onChange={handleFilterChange}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))
        ) : (
          courses.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <CourseCard
                course={course}
                onEnroll={handleEnroll}
                onUnenroll={handleUnenroll}
                isEnrolled={user.role === 'student' ? isEnrolled(course) : undefined}
              />
            </Grid>
          ))
        )}
      </Grid>
      { !loading && courses.length === 0 && (
        <Typography sx={{mt: 4, textAlign: 'center'}}>Không tìm thấy khóa học nào.</Typography>
      )}
    </Container>
  );
};

export default Courses;
