import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Tooltip,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  DragIndicator,
  PlayCircleOutline,
  Description,
  Quiz,
  CloudUpload,
  Save,
  ArrowBack,
  Reorder
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ContentEditor = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  
  const [module, setModule] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Item dialog
  const [itemDialog, setItemDialog] = useState({ open: false, mode: 'add', item: null });
  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    type: 'video',
    videoUrl: '',
    content: '',
    duration: '',
    order: 1
  });
  
  // PDF upload dialog
  const [pdfDialog, setPdfDialog] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState('');
  const [pdfDescription, setPdfDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Resources list
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchModuleData();
    fetchResources();
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModule(res.data.data);
      setItems(res.data.data.items || []);
      setLoading(false);
    } catch (error) {
      showSnackbar('Lỗi khi tải dữ liệu module', 'error');
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/resources/module/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResources(res.data.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveModule = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.put(`/api/modules/${moduleId}`, {
        title: module.title,
        description: module.description,
        items: items
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Lưu thành công!', 'success');
      setSaving(false);
    } catch (error) {
      showSnackbar('Lỗi khi lưu: ' + error.message, 'error');
      setSaving(false);
    }
  };

  const openItemDialog = (mode = 'add', item = null) => {
    if (mode === 'edit' && item) {
      setItemForm({
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'video',
        videoUrl: item.videoUrl || '',
        content: item.content || '',
        duration: item.duration || '',
        order: item.order || items.length + 1
      });
      setItemDialog({ open: true, mode: 'edit', item });
    } else {
      setItemForm({
        title: '',
        description: '',
        type: 'video',
        videoUrl: '',
        content: '',
        duration: '',
        order: items.length + 1
      });
      setItemDialog({ open: true, mode: 'add', item: null });
    }
  };

  const closeItemDialog = () => {
    setItemDialog({ open: false, mode: 'add', item: null });
    setItemForm({
      title: '',
      description: '',
      type: 'video',
      videoUrl: '',
      content: '',
      duration: '',
      order: 1
    });
  };

  const handleSaveItem = () => {
    if (!itemForm.title) {
      showSnackbar('Vui lòng nhập tiêu đề', 'warning');
      return;
    }

    if (itemDialog.mode === 'add') {
      const newItem = {
        ...itemForm,
        _id: 'temp_' + Date.now(),
        order: items.length + 1
      };
      setItems([...items, newItem]);
      showSnackbar('Đã thêm item mới', 'success');
    } else {
      const updatedItems = items.map(item =>
        item._id === itemDialog.item._id ? { ...item, ...itemForm } : item
      );
      setItems(updatedItems);
      showSnackbar('Đã cập nhật item', 'success');
    }
    
    closeItemDialog();
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Bạn có chắc muốn xóa item này?')) {
      setItems(items.filter(item => item._id !== itemId));
      showSnackbar('Đã xóa item', 'success');
    }
  };

  const handleReorderItems = (fromIndex, toIndex) => {
    const reorderedItems = [...items];
    const [movedItem] = reorderedItems.splice(fromIndex, 1);
    reorderedItems.splice(toIndex, 0, movedItem);
    
    // Update order numbers
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setItems(updatedItems);
  };

  const handleUploadPDF = async () => {
    if (!pdfFile || !pdfName) {
      showSnackbar('Vui lòng chọn file và nhập tên', 'warning');
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('name', pdfName);
      formData.append('description', pdfDescription);
      formData.append('courseId', courseId);
      formData.append('moduleId', moduleId);

      await axios.post('/api/resources/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      showSnackbar('Upload PDF thành công!', 'success');
      fetchResources();
      setPdfDialog(false);
      setPdfFile(null);
      setPdfName('');
      setPdfDescription('');
      setUploading(false);
    } catch (error) {
      showSnackbar('Lỗi khi upload: ' + error.message, 'error');
      setUploading(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Bạn có chắc muốn xóa tài liệu này?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/resources/${resourceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Đã xóa tài liệu', 'success');
      fetchResources();
    } catch (error) {
      showSnackbar('Lỗi khi xóa: ' + error.message, 'error');
    }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircleOutline />;
      case 'reading': return <Description />;
      case 'quiz': return <Quiz />;
      default: return <Description />;
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Chỉnh Sửa Nội Dung Module
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Module ID: {moduleId}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveModule}
          disabled={saving}
          size="large"
        >
          {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </Button>
      </Box>

      {/* Module Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          📝 Thông Tin Module
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tiêu đề Module"
              value={module?.title || ''}
              onChange={(e) => setModule({ ...module, title: e.target.value })}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mô tả"
              value={module?.description || ''}
              onChange={(e) => setModule({ ...module, description: e.target.value })}
              variant="outlined"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Items List */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📚 Nội Dung Bài Học ({items.length} items)
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openItemDialog('add')}
          >
            Thêm Item
          </Button>
        </Box>

        {items.length === 0 ? (
          <Alert severity="info">Chưa có nội dung nào. Hãy thêm item đầu tiên!</Alert>
        ) : (
          <List>
            {items.map((item, index) => (
              <ListItem
                key={item._id}
                sx={{
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper'
                }}
              >
                <ListItemIcon>
                  <DragIndicator sx={{ cursor: 'grab', mr: 1 }} />
                  {getItemIcon(item.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {index + 1}. {item.title}
                      </Typography>
                      <Chip label={item.type} size="small" color="primary" />
                    </Box>
                  }
                  secondary={item.description || 'Không có mô tả'}
                />
                <Box>
                  {index > 0 && (
                    <Tooltip title="Di chuyển lên">
                      <IconButton size="small" onClick={() => handleReorderItems(index, index - 1)}>
                        <Reorder />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Chỉnh sửa">
                    <IconButton size="small" onClick={() => openItemDialog('edit', item)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton size="small" color="error" onClick={() => handleDeleteItem(item._id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Resources Section */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📎 Tài Liệu & File ({resources.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setPdfDialog(true)}
            color="secondary"
          >
            Upload PDF/Tài Liệu
          </Button>
        </Box>

        {resources.length === 0 ? (
          <Alert severity="info">Chưa có tài liệu nào. Hãy upload PDF hoặc tài liệu!</Alert>
        ) : (
          <Grid container spacing={2}>
            {resources.map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 600, mb: 1 }}>
                      {resource.name}
                    </Typography>
                    <Chip label={resource.type.toUpperCase()} size="small" color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {resource.description || 'Không có mô tả'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Kích thước: {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tải: {resource.downloadCount} lần
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" href={resource.fileUrl} target="_blank">
                      Xem
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDeleteResource(resource._id)}>
                      Xóa
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Item Dialog */}
      <Dialog open={itemDialog.open} onClose={closeItemDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {itemDialog.mode === 'add' ? '➕ Thêm Item Mới' : '✏️ Chỉnh Sửa Item'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tiêu đề *"
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Loại</InputLabel>
                  <Select
                    value={itemForm.type}
                    onChange={(e) => setItemForm({ ...itemForm, type: e.target.value })}
                    label="Loại"
                  >
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="reading">Bài đọc</MenuItem>
                    <MenuItem value="quiz">Bài kiểm tra</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Thời lượng (phút)"
                  type="number"
                  value={itemForm.duration}
                  onChange={(e) => setItemForm({ ...itemForm, duration: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                />
              </Grid>
              {itemForm.type === 'video' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Video URL (YouTube)"
                    value={itemForm.videoUrl}
                    onChange={(e) => setItemForm({ ...itemForm, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </Grid>
              )}
              {itemForm.type === 'reading' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nội dung (HTML)"
                    multiline
                    rows={6}
                    value={itemForm.content}
                    onChange={(e) => setItemForm({ ...itemForm, content: e.target.value })}
                    placeholder="<p>Nhập nội dung HTML...</p>"
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeItemDialog}>Hủy</Button>
          <Button onClick={handleSaveItem} variant="contained">
            {itemDialog.mode === 'add' ? 'Thêm' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Upload Dialog */}
      <Dialog open={pdfDialog} onClose={() => setPdfDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📤 Upload PDF/Tài Liệu</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<CloudUpload />}
                >
                  Chọn File
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => {
                      setPdfFile(e.target.files[0]);
                      if (e.target.files[0] && !pdfName) {
                        setPdfName(e.target.files[0].name);
                      }
                    }}
                  />
                </Button>
                {pdfFile && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Đã chọn: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên tài liệu *"
                  value={pdfName}
                  onChange={(e) => setPdfName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={2}
                  value={pdfDescription}
                  onChange={(e) => setPdfDescription(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfDialog(false)}>Hủy</Button>
          <Button
            onClick={handleUploadPDF}
            variant="contained"
            disabled={uploading || !pdfFile || !pdfName}
          >
            {uploading ? 'Đang upload...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContentEditor;
