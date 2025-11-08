import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Grade as GradeIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';

const Progress = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const { data } = await api.get('/progress');
      setProgressData(data.data);
    } catch (error) {
      toast.error('Không thể tải thông tin tiến độ');
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const totalPoints = grades.reduce((sum, grade) => sum + (grade.score * grade.credits), 0);
    const totalCredits = grades.reduce((sum, grade) => sum + grade.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const getGradeColor = (score) => {
    if (score >= 8.5) return 'success';
    if (score >= 7.0) return 'primary';
    if (score >= 5.5) return 'warning';
    return 'error';
  };

  const getGradeLetter = (score) => {
    if (score >= 8.5) return 'A';
    if (score >= 7.8) return 'B+';
    if (score >= 7.0) return 'B';
    if (score >= 6.5) return 'C+';
    if (score >= 5.5) return 'C';
    if (score >= 4.0) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="text" height={60} />
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="rectangular" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!progressData) {
    return (
      <Container maxWidth="lg">
        <Alert severity="info">
          Chưa có dữ liệu tiến độ học tập.
        </Alert>
      </Container>
    );
  }

  const gpa = calculateGPA(progressData.grades);

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Tiến độ học tập"
        subtitle="Theo dõi điểm số và thành tích của bạn"
      />

      <Grid container spacing={3}>
        {/* Overall Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Tổng quan
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                  {gpa}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Điểm trung bình tích lũy (GPA)
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tổng tín chỉ:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {progressData.totalCredits || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Số môn đã học:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {progressData.grades?.length || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Assignment Progress */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                Bài tập
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                  {progressData.assignmentStats?.completed || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đã hoàn thành
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Tiến độ tổng thể
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressData.assignmentStats?.total > 0
                    ? (progressData.assignmentStats.completed / progressData.assignmentStats.total) * 100
                    : 0
                  }
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {progressData.assignmentStats?.completed || 0} / {progressData.assignmentStats?.total || 0} bài tập
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Course Enrollment */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1 }} />
                Khóa học
              </Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {progressData.enrolledCourses?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đang học
                </Typography>
              </Box>
              <Typography variant="body2">
                Khóa học đã hoàn thành: {progressData.completedCourses?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Grades List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <GradeIcon sx={{ mr: 1 }} />
                Bảng điểm chi tiết
              </Typography>

              {progressData.grades && progressData.grades.length > 0 ? (
                <List>
                  {progressData.grades.map((grade, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {grade.courseName}
                            </Typography>
                            <Chip
                              label={getGradeLetter(grade.score)}
                              color={getGradeColor(grade.score)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={`Tín chỉ: ${grade.credits} | Kỳ: ${grade.semester} ${grade.year}`}
                      />
                      <ListItemSecondaryAction>
                        <Typography variant="h6" color="primary">
                          {grade.score}
                        </Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  Chưa có điểm số nào được ghi nhận.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hoạt động gần đây
              </Typography>

              {progressData.recentActivity && progressData.recentActivity.length > 0 ? (
                <List>
                  {progressData.recentActivity.map((activity, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={activity.title}
                        secondary={`${activity.type} • ${new Date(activity.date).toLocaleDateString('vi-VN')}`}
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={activity.status}
                          color={activity.status === 'Hoàn thành' ? 'success' : 'default'}
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  Chưa có hoạt động nào gần đây.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Progress;
