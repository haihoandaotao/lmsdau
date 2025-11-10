import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Schedule as ClockIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AssignmentSubmit = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAssignment();
    fetchMySubmission();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/assignments/${assignmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignment(response.data.data);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      setError('Không thể tải thông tin bài tập');
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubmission = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/submissions/assignment/${assignmentId}/my-submission`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.data) {
        setSubmission(response.data.data);
        setContent(response.data.data.content || '');
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    // Check file count
    if (files.length + selectedFiles.length > 10) {
      setError('Tối đa 10 file. Vui lòng chọn ít file hơn.');
      return;
    }
    
    // Check file sizes
    const oversizedFiles = selectedFiles.filter(f => f.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Một số file vượt quá 50MB. Vui lòng chọn file nhỏ hơn.');
      return;
    }
    
    setFiles([...files, ...selectedFiles]);
    setError(null);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content && files.length === 0) {
      setError('Vui lòng nhập nội dung hoặc tải lên file');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('assignmentId', assignmentId);
      formData.append('content', content);
      
      files.forEach((file) => {
        formData.append('files', file);
      });
      
      await axios.post(
        `${API_BASE_URL}/submissions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setSuccess(true);
      setFiles([]);
      
      // Refresh submission data
      setTimeout(() => {
        fetchMySubmission();
        setSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting:', error);
      setError(error.response?.data?.message || 'Không thể nộp bài. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const isLate = () => {
    if (!assignment?.dueDate) return false;
    return new Date() > new Date(assignment.dueDate);
  };

  const getStatusChip = () => {
    if (!submission) return null;
    
    const statusConfig = {
      submitted: { label: 'Đã nộp', color: 'primary', icon: <CheckIcon /> },
      graded: { label: 'Đã chấm', color: 'success', icon: <CheckIcon /> },
      returned: { label: 'Đã trả', color: 'info', icon: <CheckIcon /> },
      resubmitted: { label: 'Nộp lại', color: 'warning', icon: <WarningIcon /> }
    };
    
    const config = statusConfig[submission.status] || statusConfig.submitted;
    
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!assignment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Không tìm thấy bài tập</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Assignment Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {assignment.title}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {assignment.description && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {assignment.description}
            </Typography>
          )}
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <ClockIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  <strong>Hạn nộp:</strong>{' '}
                  {assignment.dueDate 
                    ? new Date(assignment.dueDate).toLocaleString('vi-VN')
                    : 'Không giới hạn'
                  }
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Điểm tối đa:</strong> {assignment.maxGrade || 100}
              </Typography>
            </Grid>
          </Grid>
          
          {isLate() && !submission && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>Cảnh báo:</strong> Đã quá hạn nộp bài!
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Existing Submission */}
      {submission && (
        <Card sx={{ mb: 3, border: '2px solid', borderColor: 'success.main' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Bài nộp của bạn
              </Typography>
              {getStatusChip()}
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Ngày nộp:</strong>{' '}
                  {new Date(submission.submittedAt).toLocaleString('vi-VN')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Lần nộp:</strong> {submission.attemptNumber}
                </Typography>
              </Grid>
              
              {submission.isLate && (
                <Grid item xs={12}>
                  <Chip 
                    label="Nộp muộn" 
                    color="warning" 
                    size="small"
                    icon={<WarningIcon />}
                  />
                </Grid>
              )}
              
              {submission.status === 'graded' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Điểm:</strong>{' '}
                      <Chip 
                        label={`${submission.grade || submission.score}/${submission.maxGrade}`}
                        color={submission.grade >= (submission.maxGrade * 0.7) ? 'success' : 'error'}
                        size="small"
                      />
                    </Typography>
                  </Grid>
                  {submission.feedback && (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Nhận xét của giáo viên:
                        </Typography>
                        <Typography variant="body2">
                          {submission.feedback}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </>
              )}
              
              {submission.content && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Nội dung:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                      {submission.content}
                    </Typography>
                  </Paper>
                </Grid>
              )}
              
              {submission.files && submission.files.length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    File đã nộp:
                  </Typography>
                  <List dense>
                    {submission.files.map((file, index) => (
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
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Submit/Resubmit Form */}
      {submission?.status !== 'graded' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {submission ? 'Nộp lại bài tập' : 'Nộp bài tập'}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Nộp bài thành công!
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Nội dung bài làm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài làm của bạn..."
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ mb: 3 }}>
              <input
                accept="*/*"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  disabled={files.length >= 10}
                >
                  Chọn file ({files.length}/10)
                </Button>
              </label>
              <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                Tối đa 10 file, mỗi file không quá 50MB
              </Typography>
            </Box>
            
            {files.length > 0 && (
              <List dense sx={{ mb: 2 }}>
                {files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <FileIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={formatFileSize(file.size)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveFile(index)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
            
            <Box display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || (!content && files.length === 0)}
                startIcon={submitting ? <CircularProgress size={20} /> : <UploadIcon />}
              >
                {submitting ? 'Đang nộp...' : (submission ? 'Nộp lại' : 'Nộp bài')}
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                Hủy
              </Button>
            </Box>
          </form>
        </Paper>
      )}
      
      {submission?.status === 'graded' && (
        <Alert severity="info">
          Bài tập đã được chấm điểm. Không thể nộp lại.
        </Alert>
      )}
    </Container>
  );
};

export default AssignmentSubmit;
