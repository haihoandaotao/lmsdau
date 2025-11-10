import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  Button,
  Divider,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  MenuBook as MenuBookIcon
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
  const [completedCourses, setCompletedCourses] = useState([]);
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
      const [majorRes, curriculumRes, enrolledRes] = await Promise.all([
        api.get(`/majors/${user.major}`),
        api.get(`/curriculums/${user.curriculum}`),
        api.get('/courses/enrolled')
      ]);

      setMajor(majorRes.data.data);
      setCurriculum(curriculumRes.data.data);
      setEnrolledCourses(enrolledRes.data.data || []);

      // Get completed courses (courses with high progress)
      const completed = enrolledRes.data.data?.filter(c => c.progress >= 100) || [];
      setCompletedCourses(completed);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải thông tin chương trình đào tạo');
    } finally {
      setLoading(false);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getCourseStatus = (courseId) => {
    const enrolled = enrolledCourses.find(c => c._id === courseId || c.course?._id === courseId);
    if (!enrolled) return { status: 'not-enrolled', label: 'Chưa đăng ký', color: 'default', icon: <LockIcon /> };
    
    const progress = enrolled.progress || 0;
    if (progress >= 100) return { status: 'completed', label: 'Đã hoàn thành', color: 'success', icon: <CheckCircleIcon /> };
    if (progress > 0) return { status: 'in-progress', label: 'Đang học', color: 'primary', icon: <ScheduleIcon /> };
    
    return { status: 'enrolled', label: 'Đã đăng ký', color: 'info', icon: <ScheduleIcon /> };
  };

  const calculateProgress = () => {
    if (!curriculum) return 0;
    
    const totalCourses = curriculum.structure?.reduce((acc, year) => {
      return acc + year.courses?.filter(c => c.isRequired).length || 0;
    }, 0) || 1;
    
    const completedRequired = completedCourses.filter(c => {
      return curriculum.structure?.some(year => 
        year.courses?.some(courseItem => 
          (courseItem.course?._id === c._id || courseItem.course === c._id) && courseItem.isRequired
        )
      );
    }).length;
    
    return Math.round((completedRequired / totalCourses) * 100);
  };

  const calculateCredits = () => {
    if (!curriculum) return { earned: 0, total: curriculum?.totalCredits || 0 };
    
    const earnedCredits = completedCourses.reduce((sum, course) => {
      const credits = course.credits || course.course?.credits || 0;
      return sum + credits;
    }, 0);
    
    return { earned: earnedCredits, total: curriculum.totalCredits || 0 };
  };

  const groupBySemester = (courses) => {
    const grouped = {};
    courses?.forEach(courseItem => {
      const semester = courseItem.semester || 1;
      if (!grouped[semester]) {
        grouped[semester] = [];
      }
      grouped[semester].push(courseItem);
    });
    return grouped;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Đại cương': 'primary',
      'Cơ sở ngành': 'secondary',
      'Chuyên ngành': 'error',
      'Tự chọn': 'warning',
      'Khóa luận': 'success'
    };
    return colors[category] || 'default';
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
        <Alert severity="info">
          Bạn chưa được phân công vào ngành đào tạo. Vui lòng liên hệ phòng đào tạo.
        </Alert>
      </Box>
    );
  }

  const progress = calculateProgress();
  const credits = calculateCredits();

  return (
    <Box>
      <PageHeader
        title="Chương trình đào tạo của tôi"
        subtitle={`${major?.name} - ${user.studentClass || ''}`}
      />

      {/* Major Info Card */}
      <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 60, mb: 1 }} />
                <Typography variant="h6">{major?.code}</Typography>
                <Typography variant="body2">{major?.name}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Khung chương trình</Typography>
              <Typography variant="h6">{curriculum?.name}</Typography>
              <Typography variant="body2">Niên khóa {curriculum?.effectiveYear}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Tín chỉ tích lũy</Typography>
              <Typography variant="h6">{credits.earned} / {credits.total} TC</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(credits.earned / credits.total) * 100} 
                sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Tiến độ hoàn thành</Typography>
              <Typography variant="h6">{progress}%</Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Curriculum Structure by Year */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBookIcon /> Các học phần theo năm học
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {curriculum?.structure?.map((yearData, yearIndex) => {
              const semesterGroups = groupBySemester(yearData.courses);
              
              return (
                <Accordion 
                  key={yearIndex}
                  expanded={expanded === `year-${yearData.year}`}
                  onChange={handleAccordionChange(`year-${yearData.year}`)}
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Năm {yearData.year}
                      </Typography>
                      <Chip 
                        label={`${yearData.courses?.length || 0} học phần`} 
                        size="small" 
                        color="primary"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {Object.keys(semesterGroups).sort().map((semester) => (
                      <Box key={semester} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                          {semester === 'Summer' ? 'Học kỳ Hè' : `Học kỳ ${semester}`}
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {semesterGroups[semester].map((courseItem, idx) => {
                            const course = courseItem.course;
                            if (!course || typeof course === 'string') return null;
                            
                            const status = getCourseStatus(course._id);
                            
                            return (
                              <Grid item xs={12} key={idx}>
                                <Card 
                                  sx={{ 
                                    border: 1, 
                                    borderColor: status.status === 'completed' ? 'success.main' : 'divider',
                                    bgcolor: status.status === 'completed' ? 'success.light' : 'background.paper',
                                    '&:hover': { boxShadow: 3 },
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => navigate(`/courses/${course._id}`)}
                                >
                                  <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                      <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {course.code}
                                          </Typography>
                                          {courseItem.isRequired && (
                                            <Chip label="Bắt buộc" size="small" color="error" />
                                          )}
                                        </Box>
                                        <Typography variant="body1">{course.title}</Typography>
                                      </Grid>
                                      
                                      <Grid item xs={12} md={3}>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                          <Chip 
                                            label={`${course.credits || 3} TC`} 
                                            size="small" 
                                            variant="outlined"
                                          />
                                          {course.category && (
                                            <Chip 
                                              label={course.category} 
                                              size="small" 
                                              color={getCategoryColor(course.category)}
                                              variant="outlined"
                                            />
                                          )}
                                        </Box>
                                      </Grid>
                                      
                                      <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
                                        <Chip 
                                          icon={status.icon}
                                          label={status.label}
                                          color={status.color}
                                          size="small"
                                        />
                                        {status.status === 'not-enrolled' && (
                                          <Button 
                                            size="small" 
                                            variant="contained" 
                                            sx={{ mt: 1, display: 'block', ml: 'auto' }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigate(`/courses/${course._id}`);
                                            }}
                                          >
                                            Đăng ký
                                          </Button>
                                        )}
                                        {status.status === 'in-progress' && (
                                          <Button 
                                            size="small" 
                                            variant="contained" 
                                            color="primary"
                                            sx={{ mt: 1, display: 'block', ml: 'auto' }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigate(`/courses/${course._id}/learn`);
                                            }}
                                          >
                                            Tiếp tục học
                                          </Button>
                                        )}
                                      </Grid>
                                    </Grid>
                                  </CardContent>
                                </Card>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Paper>
        </Grid>

        {/* Categories Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Tín chỉ theo nhóm kiến thức</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {curriculum?.categories && Object.keys(curriculum.categories).map((key) => {
              const category = curriculum.categories[key];
              if (!category || !category.credits) return null;
              
              const categoryNames = {
                generalEducation: 'Giáo dục đại cương',
                foundational: 'Cơ sở ngành',
                specialized: 'Chuyên ngành',
                elective: 'Tự chọn',
                thesis: 'Khóa luận tốt nghiệp'
              };
              
              return (
                <Box key={key} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{categoryNames[key]}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {category.credits} TC
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={50} 
                    color={getCategoryColor(categoryNames[key])}
                  />
                </Box>
              );
            })}
          </Paper>
        </Grid>

        {/* Major Info */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Thông tin ngành</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Tên đầy đủ</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{major?.fullName}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Khoa</Typography>
              <Typography variant="body1">{major?.faculty}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Trình độ đào tạo</Typography>
              <Typography variant="body1">{major?.trainingLevel}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Thời gian đào tạo</Typography>
              <Typography variant="body1">{major?.duration} năm</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentCurriculum;
