import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Grading as GradeIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  InsertDriveFile as FileIcon,
  Assessment as StatsIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336'];

const SubmissionsList = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/submissions/assignment/${assignmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSubmissions(response.data.data.submissions);
      setStats(response.data.data.stats);
      setAssignment(response.data.data.assignment);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải danh sách bài nộp',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGradeDialog = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      grade: submission.grade || '',
      feedback: submission.feedback || ''
    });
    setGradeDialogOpen(true);
  };

  const handleOpenViewDialog = (submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleGradeSubmit = async () => {
    if (!gradeData.grade) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập điểm',
        severity: 'warning'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/submissions/${selectedSubmission._id}/grade`,
        {
          grade: Number(gradeData.grade),
          maxGrade: assignment.maxGrade || 100,
          feedback: gradeData.feedback
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSnackbar({
        open: true,
        message: 'Chấm điểm thành công!',
        severity: 'success'
      });
      
      setGradeDialogOpen(false);
      fetchSubmissions();
    } catch (error) {
      console.error('Error grading submission:', error);
      setSnackbar({
        open: true,
        message: 'Không thể chấm điểm. Vui lòng thử lại.',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (status, isLate) => {
    const statusConfig = {
      submitted: { label: 'Đã nộp', color: 'primary' },
      graded: { label: 'Đã chấm', color: 'success' },
      returned: { label: 'Đã trả', color: 'info' },
      resubmitted: { label: 'Nộp lại', color: 'warning' }
    };
    
    const config = statusConfig[status] || statusConfig.submitted;
    
    return (
      <Box display="flex" gap={0.5} flexDirection="column">
        <Chip label={config.label} color={config.color} size="small" />
        {isLate && <Chip label="Muộn" color="error" size="small" />}
      </Box>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Prepare chart data
  const chartData = stats ? [
    { name: 'Đã chấm', value: stats.graded, color: COLORS[0] },
    { name: 'Đã nộp', value: stats.submitted, color: COLORS[1] },
    { name: 'Nộp muộn', value: stats.late, color: COLORS[2] },
    { name: 'Chưa nộp', value: stats.notSubmitted, color: COLORS[3] }
  ].filter(item => item.value > 0) : [];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Danh sách bài nộp
          </Typography>
          {assignment && (
            <Typography variant="subtitle1" color="text.secondary">
              {assignment.title}
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
      </Box>

      {/* Statistics */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Tổng sinh viên
                    </Typography>
                    <Typography variant="h4">{stats.totalStudents}</Typography>
                  </Box>
                  <StatsIcon color="action" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Đã nộp
                    </Typography>
                    <Typography variant="h4" color="primary.main">
                      {stats.total}
                    </Typography>
                  </Box>
                  <FileIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Đã chấm
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {stats.graded}
                    </Typography>
                  </Box>
                  <GradeIcon color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Điểm TB
                    </Typography>
                    <Typography variant="h4">
                      {stats.averageGrade.toFixed(1)}%
                    </Typography>
                  </Box>
                  <GradeIcon color="action" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Chart */}
      {chartData.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Thống kê bài nộp
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
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
        </Paper>
      )}

      {/* Submissions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sinh viên</TableCell>
              <TableCell align="center">Ngày nộp</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Điểm</TableCell>
              <TableCell align="center">File</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    Chưa có bài nộp nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission._id} hover>
                  <TableCell>
                    <Typography variant="body1">{submission.student.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {submission.student.email}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {new Date(submission.submittedAt).toLocaleString('vi-VN')}
                    {submission.attemptNumber > 1 && (
                      <Chip 
                        label={`Lần ${submission.attemptNumber}`} 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {getStatusChip(submission.status, submission.isLate)}
                  </TableCell>
                  <TableCell align="center">
                    {submission.status === 'graded' ? (
                      <Chip
                        label={`${submission.grade || submission.score}/${assignment.maxGrade || 100}`}
                        color={submission.grade >= (assignment.maxGrade || 100) * 0.7 ? 'success' : 'error'}
                      />
                    ) : (
                      <Typography color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {submission.files?.length || 0} file
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenViewDialog(submission)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chấm điểm">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenGradeDialog(submission)}
                        color="success"
                      >
                        <GradeIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Submission Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chi tiết bài nộp - {selectedSubmission?.student.name}
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Ngày nộp:</strong>{' '}
                    {new Date(selectedSubmission.submittedAt).toLocaleString('vi-VN')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Trạng thái:</strong>{' '}
                    {getStatusChip(selectedSubmission.status, selectedSubmission.isLate)}
                  </Typography>
                </Grid>
              </Grid>

              {selectedSubmission.content && (
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Nội dung:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedSubmission.content}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    File đã nộp:
                  </Typography>
                  <List dense>
                    {selectedSubmission.files.map((file, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <FileIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.originalName}
                          secondary={formatFileSize(file.size)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {selectedSubmission.feedback && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Nhận xét:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                    <Typography variant="body2">
                      {selectedSubmission.feedback}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Grade Dialog */}
      <Dialog
        open={gradeDialogOpen}
        onClose={() => setGradeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Chấm điểm - {selectedSubmission?.student.name}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Điểm"
              type="number"
              value={gradeData.grade}
              onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
              inputProps={{ min: 0, max: assignment?.maxGrade || 100, step: 0.5 }}
              helperText={`Điểm tối đa: ${assignment?.maxGrade || 100}`}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Nhận xét"
              value={gradeData.feedback}
              onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
              placeholder="Nhập nhận xét cho sinh viên..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeDialogOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleGradeSubmit}
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : 'Chấm điểm'}
          </Button>
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

export default SubmissionsList;
