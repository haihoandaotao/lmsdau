import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';

const StudentCurriculum = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [major, setMajor] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState('year-1');

  useEffect(() => {
    if (user?.major && user?.curriculum) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Extract IDs if major/curriculum are objects (populated)
      const majorId = typeof user.major === 'object' ? user.major._id || user.major.id : user.major;
      const curriculumId = typeof user.curriculum === 'object' ? user.curriculum._id || user.curriculum.id : user.curriculum;

      // Fetch major details
      const majorRes = await api.get(`/majors/${majorId}`);
      setMajor(majorRes.data.data);

      // Fetch curriculum details
      const curriculumRes = await api.get(`/curriculums/${curriculumId}`);
      setCurriculum(curriculumRes.data.data);

      // Fetch enrolled courses
      const enrolledRes = await api.get('/courses/enrolled');
      setEnrolledCourses(enrolledRes.data.data || []);

    } catch (error) {
      console.error('Error fetching curriculum:', error);
      toast.error('Không thể tải chương trình đào tạo');
    } finally {
      setLoading(false);
    }
  };

  const getCourseStatus = (courseId) => {
    const enrolled = enrolledCourses.find(c => c._id === courseId);
    if (enrolled) {
      return {
        status: 'enrolled',
        label: 'Đã đăng ký',
        color: 'success',
        icon: <CheckCircleIcon fontSize="small" />
      };
    }
    return {
      status: 'not-enrolled',
      label: 'Chưa đăng ký',
      color: 'default',
      icon: <LockIcon fontSize="small" />
    };
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Đại cương': 'primary',
      'Cơ sở ngành': 'info',
      'Chuyên ngành': 'secondary',
      'Tự chọn': 'warning',
      'Khóa luận': 'error'
    };
    return colors[category] || 'default';
  };

  const getSemesterName = (semester) => {
    if (semester === 3) return 'Học kỳ Hè';
    return `Học kỳ ${semester}`;
  };

  const calculateProgress = () => {
    if (!curriculum?.structure || enrolledCourses.length === 0) return 0;
    
    const totalCourses = curriculum.structure.reduce((sum, year) => 
      sum + year.courses.length, 0
    );
    
    return totalCourses > 0 
      ? Math.round((enrolledCourses.length / totalCourses) * 100)
      : 0;
  };

  const calculateCredits = () => {
    const earned = enrolledCourses.reduce((sum, course) => sum + (course.credits || 0), 0);
    const total = curriculum?.totalCredits || 0;
    return { earned, total };
  };

  const groupBySemester = (courses) => {
    const grouped = {};
    courses.forEach(item => {
      const semester = item.semester || 1;
      if (!grouped[semester]) {
        grouped[semester] = [];
      }
      grouped[semester].push(item);
    });
    return grouped;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Đang tải...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (!user?.major || !user?.curriculum) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Bạn chưa được phân công vào ngành đào tạo. Vui lòng liên hệ phòng đào tạo.
        </Alert>
      </Box>
    );
  }

  if (!curriculum) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Không tìm thấy chương trình đào tạo. Vui lòng liên hệ quản trị viên.
        </Alert>
      </Box>
    );
  }

  const progress = calculateProgress();
  const { earned, total } = calculateCredits();

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="Chương trình đào tạo của tôi"
        subtitle={`${user.name} - ${user.studentClass || 'CNTT01'}`}
      />

      {/* Header Info Card */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
        <Typography variant="h6" gutterBottom>
          {major?.name || 'undefined'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
          {curriculum?.name} - Khóa {user.admissionYear || 2024}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
          <Typography variant="body2">
            Tiến độ: {progress}%
          </Typography>
          <Typography variant="body2">
            Tín chỉ: {earned} / {total} TC
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 1,
            bgcolor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'white'
            }
          }} 
        />
      </Paper>

      {/* Curriculum by Year */}
      {curriculum?.structure?.map((yearData, index) => {
        const yearNumber = yearData.year || (index + 1);
        const semesterGroups = groupBySemester(yearData.courses || []);
        
        return (
          <Accordion
            key={yearNumber}
            expanded={expanded === `year-${yearNumber}`}
            onChange={() => setExpanded(expanded === `year-${yearNumber}` ? '' : `year-${yearNumber}`)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="h6">
                  Năm {yearNumber}
                </Typography>
                <Chip 
                  label={`${yearData.courses?.length || 0} môn học`} 
                  size="small" 
                  color="primary"
                />
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              {Object.entries(semesterGroups)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([semester, courses]) => (
                  <Box key={semester} sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        color: 'primary.main',
                        borderBottom: 2,
                        borderColor: 'primary.main',
                        pb: 1
                      }}
                    >
                      {getSemesterName(parseInt(semester))}
                    </Typography>
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, width: '10%' }}>Mã HP</TableCell>
                            <TableCell sx={{ fontWeight: 600, width: '35%' }}>Tên học phần</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, width: '10%' }}>Số TC</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, width: '15%' }}>Loại HP</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, width: '15%' }}>Tính chất</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600, width: '15%' }}>Trạng thái</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {courses.map((item) => {
                            const course = item.course;
                            if (!course) return null;
                            
                            const status = getCourseStatus(course._id);
                            
                            return (
                              <TableRow 
                                key={course._id}
                                hover
                                sx={{ 
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" fontWeight={600}>
                                    {course.courseCode || 'N/A'}
                                  </Typography>
                                </TableCell>
                                
                                <TableCell>
                                  <Typography variant="body2">
                                    {course.title}
                                  </Typography>
                                </TableCell>
                                
                                <TableCell align="center">
                                  <Chip 
                                    label={`${course.credits || 0} TC`}
                                    size="small"
                                    color="default"
                                    variant="outlined"
                                  />
                                </TableCell>
                                
                                <TableCell align="center">
                                  <Chip 
                                    label={course.category || 'Chưa phân loại'}
                                    size="small"
                                    color={getCategoryColor(course.category)}
                                    variant="outlined"
                                  />
                                </TableCell>
                                
                                <TableCell align="center">
                                  <Chip 
                                    label={course.courseType || item.isRequired ? 'Bắt buộc' : 'Tự chọn'}
                                    size="small"
                                    color={item.isRequired ? 'error' : 'default'}
                                    variant="outlined"
                                  />
                                </TableCell>
                                
                                <TableCell align="center">
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <Chip 
                                      icon={status.icon}
                                      label={status.label}
                                      size="small"
                                      color={status.color}
                                      variant={status.status === 'enrolled' ? 'filled' : 'outlined'}
                                    />
                                    <Tooltip title="Xem chi tiết">
                                      <IconButton 
                                        size="small"
                                        onClick={() => navigate(`/courses/${course._id}`)}
                                      >
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Summary Statistics */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tổng kết chương trình
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mt: 2 }}>
          {curriculum?.categories && Object.entries(curriculum.categories).map(([key, data]) => {
            if (!data || data.credits === 0) return null;
            
            const labels = {
              generalEducation: 'Đại cương',
              foundational: 'Cơ sở ngành',
              specialized: 'Chuyên ngành',
              elective: 'Tự chọn',
              thesis: 'Khóa luận'
            };
            
            return (
              <Box key={key} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {labels[key]}
                </Typography>
                <Typography variant="h6">
                  {data.credits} tín chỉ
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {data.courses?.length || 0} môn học
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentCurriculum;
