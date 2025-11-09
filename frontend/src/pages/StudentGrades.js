import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const COLORS = {
  assignment: '#2196F3',
  quiz: '#9C27B0',
  discussion: '#4CAF50',
  attendance: '#FF9800',
  manual: '#607D8B'
};

const StudentGrades = () => {
  const { courseId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [gradeData, setGradeData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyGrades();
  }, [courseId]);

  const fetchMyGrades = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/grades/my-grades/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGradeData(response.data.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setError('Không thể tải điểm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'graded':
        return <CheckCircleIcon color="success" />;
      case 'submitted':
        return <ScheduleIcon color="info" />;
      case 'not_submitted':
        return <CancelIcon color="error" />;
      case 'late':
        return <WarningIcon color="warning" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'graded': return 'Đã chấm';
      case 'submitted': return 'Đã nộp';
      case 'not_submitted': return 'Chưa nộp';
      case 'late': return 'Nộp muộn';
      case 'excused': return 'Được miễn';
      default: return status;
    }
  };

  const getItemTypeLabel = (type) => {
    switch (type) {
      case 'assignment': return 'Bài tập';
      case 'quiz': return 'Bài kiểm tra';
      case 'discussion': return 'Thảo luận';
      case 'attendance': return 'Điểm danh';
      case 'manual': return 'Thủ công';
      default: return type;
    }
  };

  // Prepare chart data
  const chartData = gradeData ? Object.entries(
    gradeData.items.reduce((acc, item) => {
      if (!acc[item.itemType]) {
        acc[item.itemType] = { 
          name: getItemTypeLabel(item.itemType),
          value: 0,
          count: 0
        };
      }
      acc[item.itemType].value += item.earnedPoints;
      acc[item.itemType].count += 1;
      return acc;
    }, {})
  ).map(([type, data]) => ({
    name: data.name,
    value: data.value,
    count: data.count,
    color: COLORS[type]
  })) : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!gradeData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Chưa có điểm nào cho khóa học này.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Điểm của bạn
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {gradeData.course.code} - {gradeData.course.title}
        </Typography>
      </Box>

      {/* Overall Grade Card */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          background: gradeData.isPassing 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h2" fontWeight="bold">
                {gradeData.currentGrade.toFixed(1)}%
              </Typography>
              <Typography variant="h5" mt={1}>
                Điểm chữ: {gradeData.letterGrade}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Tổng điểm
              </Typography>
              <Typography variant="h4">
                {gradeData.totalEarned.toFixed(1)} / {gradeData.totalPossible}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={gradeData.currentGrade} 
                sx={{ 
                  mt: 2, 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Trạng thái
              </Typography>
              <Chip 
                label={gradeData.isPassing ? 'Đạt' : 'Không đạt'}
                icon={gradeData.isPassing ? <CheckCircleIcon /> : <CancelIcon />}
                sx={{ 
                  fontSize: '1.1rem',
                  padding: '20px 10px',
                  backgroundColor: 'white',
                  color: gradeData.isPassing ? '#4CAF50' : '#F44336'
                }}
              />
              <Typography variant="body2" mt={2}>
                Điểm đạt: {gradeData.course.passingGrade}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Charts and Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân bố điểm theo loại
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count }) => `${name} (${count})`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê
              </Typography>
              <Box mt={3}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {gradeData.items.filter(i => i.status === 'graded').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Đã chấm
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {gradeData.items.filter(i => i.status === 'submitted').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Chờ chấm
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error">
                        {gradeData.items.filter(i => i.status === 'not_submitted').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Chưa nộp
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {gradeData.items.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tổng cộng
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Grade Items */}
      <Paper>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>
            Chi tiết điểm
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell align="center">Điểm</TableCell>
                <TableCell align="center">Phần trăm</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell>Ngày nộp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gradeData.items.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Typography variant="body1">{item.itemName}</Typography>
                    {item.feedback && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Nhận xét: {item.feedback}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getItemTypeLabel(item.itemType)} 
                      size="small"
                      sx={{ backgroundColor: COLORS[item.itemType], color: 'white' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body1" fontWeight="bold">
                      {item.earnedPoints} / {item.maxPoints}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box>
                      <Typography 
                        variant="h6" 
                        color={item.percentage >= 70 ? 'success.main' : 'error.main'}
                      >
                        {item.percentage}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={item.percentage} 
                        color={item.percentage >= 70 ? 'success' : 'error'}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      {getStatusIcon(item.status)}
                      <Typography variant="body2">
                        {getStatusLabel(item.status)}
                      </Typography>
                    </Box>
                    {item.isLate && (
                      <Chip label="Nộp muộn" size="small" color="warning" sx={{ mt: 0.5 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.submittedAt ? (
                      <Typography variant="body2">
                        {new Date(item.submittedAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Chưa nộp
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default StudentGrades;
