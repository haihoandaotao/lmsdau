import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Button,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const COLORS = ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];

const Gradebook = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [course, setCourse] = useState(null);
  const [orderBy, setOrderBy] = useState('currentGrade');
  const [order, setOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchGradebook();
  }, [courseId]);

  const fetchGradebook = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/grades/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setGrades(response.data.data.grades);
      setStats(response.data.data.stats);
      setCourse(response.data.data.course);
    } catch (error) {
      console.error('Error fetching gradebook:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải bảng điểm',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/grades/export/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gradebook_${courseId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSnackbar({
        open: true,
        message: 'Xuất bảng điểm thành công',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exporting gradebook:', error);
      setSnackbar({
        open: true,
        message: 'Không thể xuất bảng điểm',
        severity: 'error'
      });
    }
  };

  const handleRecalculate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/grades/recalculate/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSnackbar({
        open: true,
        message: 'Tính toán lại điểm thành công',
        severity: 'success'
      });
      
      fetchGradebook();
    } catch (error) {
      console.error('Error recalculating grades:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tính toán lại điểm',
        severity: 'error'
      });
    }
  };

  const handleEditGrade = (grade) => {
    setSelectedGrade(grade);
    setOpenEditDialog(true);
  };

  const filteredGrades = grades
    .filter(grade => {
      if (filterStatus !== 'all' && grade.status !== filterStatus) return false;
      if (searchTerm && !grade.student.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];
      
      if (orderBy === 'student') {
        aValue = a.student.name;
        bValue = b.student.name;
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'passing': return 'success';
      case 'failing': return 'error';
      case 'at_risk': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'passing': return 'Đạt';
      case 'failing': return 'Không đạt';
      case 'at_risk': return 'Cảnh báo';
      case 'incomplete': return 'Chưa hoàn thành';
      default: return status;
    }
  };

  // Prepare chart data
  const distributionData = stats ? [
    { name: 'A (90-100)', value: stats.gradeDistribution.A, color: COLORS[0] },
    { name: 'B (80-89)', value: stats.gradeDistribution.B, color: COLORS[1] },
    { name: 'C (70-79)', value: stats.gradeDistribution.C, color: COLORS[2] },
    { name: 'D (60-69)', value: stats.gradeDistribution.D, color: COLORS[3] },
    { name: 'F (<60)', value: stats.gradeDistribution.F, color: COLORS[4] }
  ] : [];

  const statusData = stats ? [
    { name: 'Đạt', value: stats.passingStudents },
    { name: 'Cảnh báo', value: stats.atRiskStudents },
    { name: 'Không đạt', value: stats.failingStudents }
  ] : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Bảng Điểm
          </Typography>
          {course && (
            <Typography variant="subtitle1" color="text.secondary">
              {course.code} - {course.title}
            </Typography>
          )}
        </Box>
        <Box>
          <Tooltip title="Tính lại điểm">
            <IconButton onClick={handleRecalculate} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xuất CSV">
            <IconButton onClick={handleExport} color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Tổng sinh viên
                </Typography>
                <Typography variant="h4">{stats.totalStudents}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Điểm trung bình
                </Typography>
                <Typography variant="h4">{stats.averageGrade.toFixed(1)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Sinh viên đạt
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.passingStudents}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Sinh viên cảnh báo
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.atRiskStudents}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phân bố điểm
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trạng thái sinh viên
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="value" fill="#C8102E" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Tìm kiếm sinh viên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên sinh viên..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              select
              label="Lọc theo trạng thái"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="passing">Đạt</MenuItem>
              <MenuItem value="at_risk">Cảnh báo</MenuItem>
              <MenuItem value="failing">Không đạt</MenuItem>
              <MenuItem value="incomplete">Chưa hoàn thành</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Grades Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'student'}
                  direction={orderBy === 'student' ? order : 'asc'}
                  onClick={() => handleSort('student')}
                >
                  Sinh viên
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'currentGrade'}
                  direction={orderBy === 'currentGrade' ? order : 'asc'}
                  onClick={() => handleSort('currentGrade')}
                >
                  Điểm số
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Điểm chữ</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Hoàn thành</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGrades.map((grade) => (
              <TableRow key={grade._id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body1">{grade.student.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {grade.student.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6">
                    {grade.currentGrade.toFixed(1)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {grade.totalEarned.toFixed(1)} / {grade.totalPossible}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={grade.letterGrade} 
                    color={grade.currentGrade >= 70 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={getStatusLabel(grade.status)} 
                    color={getStatusColor(grade.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {grade.items.length} mục
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Xem chi tiết">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditGrade(grade)}
                      color="primary"
                    >
                      <AssessmentIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Grade Detail Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chi tiết điểm - {selectedGrade?.student.name}
        </DialogTitle>
        <DialogContent>
          {selectedGrade && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Tổng quan
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                  <Typography>Điểm hiện tại: <strong>{selectedGrade.currentGrade.toFixed(1)}%</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Điểm chữ: <strong>{selectedGrade.letterGrade}</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Tổng điểm: <strong>{selectedGrade.totalEarned.toFixed(1)} / {selectedGrade.totalPossible}</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Trạng thái: <Chip label={getStatusLabel(selectedGrade.status)} color={getStatusColor(selectedGrade.status)} size="small" /></Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Chi tiết các mục điểm
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên</TableCell>
                      <TableCell>Loại</TableCell>
                      <TableCell align="center">Điểm</TableCell>
                      <TableCell align="center">Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedGrade.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>
                          <Chip label={item.itemType} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          {item.earnedPoints} / {item.maxPoints} ({item.percentage}%)
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={item.status} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Gradebook;
