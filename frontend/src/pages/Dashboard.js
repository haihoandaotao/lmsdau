import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/progress/dashboard');
      setDashboard(response.data.data);
    } catch (error) {
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Chào mừng, {user?.name}!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Vai trò: {user?.role === 'student' ? 'Sinh viên' : user?.role === 'teacher' ? 'Giảng viên' : 'Quản trị viên'}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {user?.role === 'student' && dashboard && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <SchoolIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboard.totalCourses}</Typography>
                      <Typography color="text.secondary">Khóa học</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboard.totalAssignments}</Typography>
                      <Typography color="text.secondary">Bài tập</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboard.completedAssignments}</Typography>
                      <Typography color="text.secondary">Đã hoàn thành</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <PendingIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboard.pendingAssignments}</Typography>
                      <Typography color="text.secondary">Chưa hoàn thành</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Bài tập sắp đến hạn
                </Typography>
                <List>
                  {dashboard.upcomingAssignments?.length > 0 ? (
                    dashboard.upcomingAssignments.map((assignment) => (
                      <ListItem key={assignment._id}>
                        <ListItemText
                          primary={assignment.title}
                          secondary={`Hạn nộp: ${new Date(assignment.dueDate).toLocaleDateString('vi-VN')}`}
                        />
                        <Chip label={assignment.type} size="small" />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary">Không có bài tập sắp đến hạn</Typography>
                  )}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Bài đã nộp gần đây
                </Typography>
                <List>
                  {dashboard.recentSubmissions?.length > 0 ? (
                    dashboard.recentSubmissions.map((submission) => (
                      <ListItem key={submission._id}>
                        <ListItemText
                          primary={submission.assignment?.title}
                          secondary={`Nộp lúc: ${new Date(submission.submittedAt).toLocaleString('vi-VN')}`}
                        />
                        <Chip 
                          label={submission.status === 'graded' ? `${submission.score} điểm` : 'Chưa chấm'} 
                          size="small"
                          color={submission.status === 'graded' ? 'success' : 'default'}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary">Chưa có bài nộp</Typography>
                  )}
                </List>
              </Paper>
            </Grid>
          </>
        )}

        {user?.role === 'teacher' && dashboard && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <SchoolIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboard.totalCourses}</Typography>
                      <Typography color="text.secondary">Khóa học giảng dạy</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboard.totalStudents}</Typography>
                      <Typography color="text.secondary">Sinh viên</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboard.totalAssignments}</Typography>
                      <Typography color="text.secondary">Bài tập</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <PendingIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{dashboard.pendingGrading}</Typography>
                      <Typography color="text.secondary">Chờ chấm điểm</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Khóa học của bạn
                </Typography>
                <List>
                  {dashboard.courses?.map((course) => (
                    <ListItem key={course._id}>
                      <ListItemText
                        primary={course.title}
                        secondary={`Mã: ${course.code} | Sinh viên: ${course.enrolledStudents}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
