import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Alert,
  Skeleton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Grade as GradeIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', description: '', action: null });

  useEffect(() => {
    fetchAssignmentDetail();
    if (user.role === 'teacher') {
      fetchSubmissions();
    }
  }, [id]);

  const fetchAssignmentDetail = async () => {
    try {
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data.data);
    } catch (error) {
      toast.error('Không thể tải thông tin bài tập');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data } = await api.get(`/assignments/${id}/submissions`);
      setSubmissions(data.data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File không được vượt quá 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file để nộp');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      };

      await api.post(`/assignments/${id}/submit`, formData, config);
      toast.success('Nộp bài tập thành công!');
      setSelectedFile(null);
      setUploadProgress(0);
      // Refresh assignment data to show submission status
      fetchAssignmentDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Nộp bài thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (submissionId, filename) => {
    try {
      const response = await api.get(`/submissions/${submissionId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Không thể tải file');
    }
  };

  const handleGrade = async (submissionId, grade, feedback) => {
    try {
      await api.patch(`/submissions/${submissionId}/grade`, { grade, feedback });
      toast.success('Chấm điểm thành công!');
      fetchSubmissions();
    } catch (error) {
      toast.error('Chấm điểm thất bại');
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    try {
      await api.delete(`/submissions/${submissionId}`);
      toast.success('Xóa bài nộp thành công!');
      fetchSubmissions();
      if (user.role === 'student') {
        fetchAssignmentDetail();
      }
    } catch (error) {
      toast.error('Xóa bài nộp thất bại');
    }
  };

  const openConfirmDialog = (title, description, action) => {
    setConfirmDialog({ open: true, title, description, action });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, title: '', description: '', action: null });
  };

  const confirmAction = () => {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    closeConfirmDialog();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="text" height={60} />
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="rectangular" height={300} />
      </Container>
    );
  }

  if (!assignment) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">Không tìm thấy bài tập</Alert>
      </Container>
    );
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();
  const hasSubmitted = assignment.submission?.status === 'submitted';

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={assignment.title}
        subtitle={`Khóa học: ${assignment.course?.title}`}
      />

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mô tả bài tập
              </Typography>
              <Typography variant="body1" paragraph>
                {assignment.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<CalendarIcon />}
                  label={`Hạn nộp: ${new Date(assignment.dueDate).toLocaleDateString('vi-VN')}`}
                  color={isOverdue ? 'error' : 'default'}
                />
                <Chip
                  icon={<PersonIcon />}
                  label={`GV: ${assignment.course?.instructor?.name}`}
                />
                {assignment.maxScore && (
                  <Chip
                    icon={<GradeIcon />}
                    label={`Điểm tối đa: ${assignment.maxScore}`}
                  />
                )}
              </Box>

              {isOverdue && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Bài tập này đã quá hạn nộp.
                </Alert>
              )}
            </CardContent>
          </Card>

          {user.role === 'student' && (
            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Nộp bài tập
                </Typography>

                {hasSubmitted ? (
                  <Alert severity="success">
                    Bạn đã nộp bài tập vào {new Date(assignment.submission.submittedAt).toLocaleString('vi-VN')}
                    {assignment.submission.grade !== undefined && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Điểm: {assignment.submission.grade}/{assignment.maxScore}
                      </Typography>
                    )}
                    {assignment.submission.feedback && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Phản hồi: {assignment.submission.feedback}
                      </Typography>
                    )}
                  </Alert>
                ) : (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <input
                        accept="*/*"
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        onChange={handleFileSelect}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          fullWidth
                          disabled={uploading}
                        >
                          Chọn file để nộp
                        </Button>
                      </label>
                    </Box>

                    {selectedFile && (
                      <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography variant="body2">
                          File đã chọn: {selectedFile.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Kích thước: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Paper>
                    )}

                    {uploading && (
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                        <Typography variant="caption" sx={{ mt: 1 }}>
                          Đang tải lên... {uploadProgress}%
                        </Typography>
                      </Box>
                    )}

                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={!selectedFile || uploading}
                      fullWidth
                    >
                      {uploading ? 'Đang nộp...' : 'Nộp bài'}
                    </Button>
                  </>
                )}

                {hasSubmitted && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => openConfirmDialog(
                        'Xóa bài nộp',
                        'Bạn có chắc chắn muốn xóa bài nộp này?',
                        () => handleDeleteSubmission(assignment.submission._id)
                      )}
                      fullWidth
                    >
                      Xóa bài nộp
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          {user.role === 'teacher' && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Danh sách bài nộp ({submissions.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {submissions.length > 0 ? (
                  <List>
                    {submissions.map((submission) => (
                      <ListItem key={submission._id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                        <ListItemText
                          primary={submission.student?.name}
                          secondary={`Nộp: ${new Date(submission.submittedAt).toLocaleDateString('vi-VN')}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleDownload(submission._id, submission.filename)}
                          >
                            <DownloadIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => openConfirmDialog(
                              'Xóa bài nộp',
                              `Xóa bài nộp của ${submission.student?.name}?`,
                              () => handleDeleteSubmission(submission._id)
                            )}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary">
                    Chưa có bài nộp nào.
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin
              </Typography>
              <Typography variant="body2">
                <strong>Khóa học:</strong> {assignment.course?.title}
              </Typography>
              <Typography variant="body2">
                <strong>Giảng viên:</strong> {assignment.course?.instructor?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Hạn nộp:</strong> {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
              </Typography>
              {assignment.maxScore && (
                <Typography variant="body2">
                  <strong>Điểm tối đa:</strong> {assignment.maxScore}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        onConfirm={confirmAction}
        title={confirmDialog.title}
        description={confirmDialog.description}
      />
    </Container>
  );
};

export default AssignmentDetail;
