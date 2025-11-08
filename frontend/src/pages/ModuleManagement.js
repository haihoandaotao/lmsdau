import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  VideoLibrary as VideoIcon,
  Description as ReadingIcon,
  Quiz as QuizIcon,
  Assignment as AssignmentIcon,
  Forum as ForumIcon,
  DragIndicator as DragIcon,
  ArrowBack as BackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ModuleManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Module dialog state
  const [moduleDialog, setModuleDialog] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    learningObjectives: '',
    isPublished: true,
    unlockCondition: 'none'
  });
  
  // Item dialog state
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [itemForm, setItemForm] = useState({
    type: 'video',
    title: '',
    description: '',
    // Video fields
    videoUrl: '',
    videoProvider: 'youtube',
    videoDuration: 0,
    thumbnail: '',
    // Reading fields
    content: '',
    readingTime: 0,
    // Quiz/Assignment fields
    quizReference: '',
    assignmentReference: '',
    // Common fields
    unlockCondition: 'none',
    isRequired: true
  });

  useEffect(() => {
    fetchCourseAndModules();
  }, [courseId]);

  const fetchCourseAndModules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch course
      const courseRes = await axios.get(`${API_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(courseRes.data);
      
      // Fetch modules
      const modulesRes = await axios.get(`${API_URL}/modules/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(modulesRes.data);
      
      setLoading(false);
    } catch (err) {
      setError('Không thể tải dữ liệu: ' + err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  // Module CRUD operations
  const handleOpenModuleDialog = (module = null) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({
        title: module.title,
        description: module.description || '',
        learningObjectives: module.learningObjectives?.join('\n') || '',
        isPublished: module.isPublished,
        unlockCondition: module.unlockCondition
      });
    } else {
      setEditingModule(null);
      setModuleForm({
        title: '',
        description: '',
        learningObjectives: '',
        isPublished: true,
        unlockCondition: 'none'
      });
    }
    setModuleDialog(true);
  };

  const handleSaveModule = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = {
        ...moduleForm,
        course: courseId,
        learningObjectives: moduleForm.learningObjectives
          .split('\n')
          .filter(obj => obj.trim())
      };

      if (editingModule) {
        await axios.put(`${API_URL}/modules/${editingModule._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Cập nhật module thành công!');
      } else {
        await axios.post(`${API_URL}/modules`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Tạo module mới thành công!');
      }

      setModuleDialog(false);
      fetchCourseAndModules();
    } catch (err) {
      setError('Lỗi: ' + err.response?.data?.message || err.message);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Bạn có chắc muốn xóa module này?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Xóa module thành công!');
      fetchCourseAndModules();
    } catch (err) {
      setError('Lỗi: ' + err.response?.data?.message || err.message);
    }
  };

  // Item CRUD operations
  const handleOpenItemDialog = (moduleId, item = null) => {
    setCurrentModuleId(moduleId);
    
    if (item) {
      setEditingItem(item);
      setItemForm({
        type: item.type,
        title: item.title,
        description: item.description || '',
        videoUrl: item.videoUrl || '',
        videoProvider: item.videoProvider || 'youtube',
        videoDuration: item.videoDuration || 0,
        thumbnail: item.thumbnail || '',
        content: item.content || '',
        readingTime: item.readingTime || 0,
        quizReference: item.quizReference || '',
        assignmentReference: item.assignmentReference || '',
        unlockCondition: item.unlockCondition || 'none',
        isRequired: item.isRequired !== false
      });
    } else {
      setEditingItem(null);
      setItemForm({
        type: 'video',
        title: '',
        description: '',
        videoUrl: '',
        videoProvider: 'youtube',
        videoDuration: 0,
        thumbnail: '',
        content: '',
        readingTime: 0,
        quizReference: '',
        assignmentReference: '',
        unlockCondition: 'none',
        isRequired: true
      });
    }
    setItemDialog(true);
  };

  const handleSaveItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = { ...itemForm };

      if (editingItem) {
        await axios.put(
          `${API_URL}/modules/${currentModuleId}/items/${editingItem._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Cập nhật bài học thành công!');
      } else {
        await axios.post(
          `${API_URL}/modules/${currentModuleId}/items`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Thêm bài học mới thành công!');
      }

      setItemDialog(false);
      fetchCourseAndModules();
    } catch (err) {
      setError('Lỗi: ' + err.response?.data?.message || err.message);
    }
  };

  const handleDeleteItem = async (moduleId, itemId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài học này?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/modules/${moduleId}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Xóa bài học thành công!');
      fetchCourseAndModules();
    } catch (err) {
      setError('Lỗi: ' + err.response?.data?.message || err.message);
    }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'video': return <VideoIcon />;
      case 'reading': return <ReadingIcon />;
      case 'quiz': return <QuizIcon />;
      case 'assignment': return <AssignmentIcon />;
      case 'discussion': return <ForumIcon />;
      default: return <ReadingIcon />;
    }
  };

  const getItemTypeLabel = (type) => {
    const labels = {
      video: 'Video',
      reading: 'Bài đọc',
      quiz: 'Bài kiểm tra',
      assignment: 'Bài tập',
      discussion: 'Thảo luận'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(`/courses/${courseId}`)}
          sx={{ mb: 2 }}
        >
          Quay lại khóa học
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Quản lý nội dung khóa học
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {course?.title}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModuleDialog()}
          >
            Thêm Module
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Modules List */}
      {modules.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có module nào
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Bắt đầu bằng cách tạo module đầu tiên cho khóa học
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModuleDialog()}
            >
              Tạo Module Đầu Tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        modules.map((module, index) => (
          <Accordion key={module._id} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                <DragIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    Module {module.order}: {module.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip
                      size="small"
                      label={module.isPublished ? 'Đã xuất bản' : 'Nháp'}
                      color={module.isPublished ? 'success' : 'default'}
                    />
                    <Chip
                      size="small"
                      label={`${module.itemCount} bài học`}
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModuleDialog(module);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteModule(module._id);
                  }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {module.description && (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {module.description}
                </Typography>
              )}
              
              {/* Module Items List */}
              <List>
                {module.items?.map((item, itemIndex) => (
                  <React.Fragment key={item._id}>
                    <ListItem>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        {getItemIcon(item.type)}
                      </Box>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography>
                              {itemIndex + 1}. {item.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={getItemTypeLabel(item.type)}
                              variant="outlined"
                            />
                            {item.unlockCondition === 'sequential' && (
                              <Chip size="small" label="Tuần tự" color="info" />
                            )}
                          </Box>
                        }
                        secondary={
                          item.type === 'video'
                            ? `Video • ${Math.floor(item.videoDuration / 60)}:${(item.videoDuration % 60).toString().padStart(2, '0')}`
                            : item.type === 'reading'
                            ? `Bài đọc • ${item.readingTime} phút`
                            : item.description
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => handleOpenItemDialog(module._id, item)}
                          edge="end"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteItem(module._id, item._id)}
                          edge="end"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {itemIndex < module.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleOpenItemDialog(module._id)}
                sx={{ mt: 2 }}
              >
                Thêm bài học
              </Button>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* Module Dialog */}
      <Dialog open={moduleDialog} onClose={() => setModuleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingModule ? 'Chỉnh sửa Module' : 'Tạo Module Mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Tiêu đề module"
              fullWidth
              required
              value={moduleForm.title}
              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
            />
            
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={3}
              value={moduleForm.description}
              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
            />
            
            <TextField
              label="Mục tiêu học tập (mỗi dòng một mục tiêu)"
              fullWidth
              multiline
              rows={4}
              value={moduleForm.learningObjectives}
              onChange={(e) => setModuleForm({ ...moduleForm, learningObjectives: e.target.value })}
              helperText="Nhập mỗi mục tiêu trên một dòng"
            />
            
            <FormControl fullWidth>
              <InputLabel>Điều kiện mở khóa</InputLabel>
              <Select
                value={moduleForm.unlockCondition}
                onChange={(e) => setModuleForm({ ...moduleForm, unlockCondition: e.target.value })}
              >
                <MenuItem value="none">Không có</MenuItem>
                <MenuItem value="sequential">Tuần tự (phải hoàn thành module trước)</MenuItem>
                <MenuItem value="date">Theo ngày</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={moduleForm.isPublished}
                  onChange={(e) => setModuleForm({ ...moduleForm, isPublished: e.target.checked })}
                />
              }
              label="Xuất bản (sinh viên có thể xem)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModuleDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSaveModule}
            startIcon={<SaveIcon />}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Item Dialog */}
      <Dialog open={itemDialog} onClose={() => setItemDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Loại bài học</InputLabel>
              <Select
                value={itemForm.type}
                onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })}
                disabled={!!editingItem}
              >
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="reading">Bài đọc</MenuItem>
                <MenuItem value="quiz">Bài kiểm tra</MenuItem>
                <MenuItem value="assignment">Bài tập</MenuItem>
                <MenuItem value="discussion">Thảo luận</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Tiêu đề"
              fullWidth
              required
              value={itemForm.title}
              onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
            />
            
            <TextField
              label="Mô tả"
              fullWidth
              multiline
              rows={2}
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            />
            
            {/* Video fields */}
            {itemForm.type === 'video' && (
              <>
                <TextField
                  label="URL Video (YouTube hoặc MP4)"
                  fullWidth
                  required
                  value={itemForm.videoUrl}
                  onChange={(e) => setItemForm({ ...itemForm, videoUrl: e.target.value })}
                  helperText="Ví dụ: https://www.youtube.com/watch?v=VIDEO_ID hoặc URL MP4"
                />
                
                <FormControl fullWidth>
                  <InputLabel>Loại video</InputLabel>
                  <Select
                    value={itemForm.videoProvider}
                    onChange={(e) => setItemForm({ ...itemForm, videoProvider: e.target.value })}
                  >
                    <MenuItem value="youtube">YouTube</MenuItem>
                    <MenuItem value="vimeo">Vimeo</MenuItem>
                    <MenuItem value="mp4">MP4 (Direct link)</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  label="Thời lượng (giây)"
                  type="number"
                  fullWidth
                  value={itemForm.videoDuration}
                  onChange={(e) => setItemForm({ ...itemForm, videoDuration: parseInt(e.target.value) || 0 })}
                />
                
                <TextField
                  label="URL Thumbnail (tùy chọn)"
                  fullWidth
                  value={itemForm.thumbnail}
                  onChange={(e) => setItemForm({ ...itemForm, thumbnail: e.target.value })}
                />
              </>
            )}
            
            {/* Reading fields */}
            {itemForm.type === 'reading' && (
              <>
                <TextField
                  label="Nội dung bài đọc"
                  fullWidth
                  required
                  multiline
                  rows={6}
                  value={itemForm.content}
                  onChange={(e) => setItemForm({ ...itemForm, content: e.target.value })}
                  helperText="Hỗ trợ Markdown"
                />
                
                <TextField
                  label="Thời gian đọc ước tính (phút)"
                  type="number"
                  fullWidth
                  value={itemForm.readingTime}
                  onChange={(e) => setItemForm({ ...itemForm, readingTime: parseInt(e.target.value) || 0 })}
                />
              </>
            )}
            
            {/* Quiz fields */}
            {itemForm.type === 'quiz' && (
              <TextField
                label="ID Bài kiểm tra"
                fullWidth
                value={itemForm.quizReference}
                onChange={(e) => setItemForm({ ...itemForm, quizReference: e.target.value })}
                helperText="Liên kết với bài kiểm tra trong hệ thống"
              />
            )}
            
            {/* Assignment fields */}
            {itemForm.type === 'assignment' && (
              <TextField
                label="ID Bài tập"
                fullWidth
                value={itemForm.assignmentReference}
                onChange={(e) => setItemForm({ ...itemForm, assignmentReference: e.target.value })}
                helperText="Liên kết với bài tập trong hệ thống"
              />
            )}
            
            <FormControl fullWidth>
              <InputLabel>Điều kiện mở khóa</InputLabel>
              <Select
                value={itemForm.unlockCondition}
                onChange={(e) => setItemForm({ ...itemForm, unlockCondition: e.target.value })}
              >
                <MenuItem value="none">Không có</MenuItem>
                <MenuItem value="sequential">Tuần tự (phải hoàn thành bài trước)</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={itemForm.isRequired}
                  onChange={(e) => setItemForm({ ...itemForm, isRequired: e.target.checked })}
                />
              }
              label="Bắt buộc hoàn thành"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialog(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSaveItem}
            startIcon={<SaveIcon />}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ModuleManagement;
