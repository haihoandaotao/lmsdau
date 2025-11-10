import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import PageHeader from '../components/common/PageHeader';

const MajorManagement = () => {
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMajor, setCurrentMajor] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    fullName: '',
    description: '',
    faculty: '',
    trainingLevel: 'Đại học',
    duration: 4,
    totalCredits: 120,
    admissionYear: new Date().getFullYear(),
    objectives: [],
    careerOpportunities: [],
    isActive: true
  });

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/majors');
      setMajors(data.data);
    } catch (error) {
      toast.error('Không thể tải danh sách ngành');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (major = null) => {
    if (major) {
      setEditMode(true);
      setCurrentMajor(major);
      setFormData({
        code: major.code,
        name: major.name,
        fullName: major.fullName || '',
        description: major.description || '',
        faculty: major.faculty,
        trainingLevel: major.trainingLevel || 'Đại học',
        duration: major.duration || 4,
        totalCredits: major.totalCredits || 120,
        admissionYear: major.admissionYear || new Date().getFullYear(),
        objectives: major.objectives || [],
        careerOpportunities: major.careerOpportunities || [],
        isActive: major.isActive
      });
    } else {
      setEditMode(false);
      setCurrentMajor(null);
      setFormData({
        code: '',
        name: '',
        fullName: '',
        description: '',
        faculty: '',
        trainingLevel: 'Đại học',
        duration: 4,
        totalCredits: 120,
        admissionYear: new Date().getFullYear(),
        objectives: [],
        careerOpportunities: [],
        isActive: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentMajor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.code || !formData.name || !formData.faculty) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      if (editMode) {
        await api.put(`/majors/${currentMajor._id}`, formData);
        toast.success('Cập nhật ngành thành công');
      } else {
        await api.post('/majors', formData);
        toast.success('Tạo ngành mới thành công');
      }

      handleCloseDialog();
      fetchMajors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ngành "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/majors/${id}`);
      toast.success('Xóa ngành thành công');
      fetchMajors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa ngành');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        <PageHeader
          title="Quản lý Ngành đào tạo"
          subtitle="Danh mục các ngành đào tạo của trường"
          icon={<SchoolIcon />}
        />

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Tổng số: <strong>{majors.length}</strong> ngành
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Thêm Ngành mới
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Mã ngành</strong></TableCell>
                <TableCell><strong>Tên ngành</strong></TableCell>
                <TableCell><strong>Khoa</strong></TableCell>
                <TableCell align="center"><strong>Thời gian</strong></TableCell>
                <TableCell align="center"><strong>Tín chỉ</strong></TableCell>
                <TableCell align="center"><strong>Sinh viên</strong></TableCell>
                <TableCell align="center"><strong>Học phần</strong></TableCell>
                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                <TableCell align="center"><strong>Thao tác</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {majors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Alert severity="info">Chưa có ngành nào</Alert>
                  </TableCell>
                </TableRow>
              ) : (
                majors.map((major) => (
                  <TableRow key={major._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {major.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {major.name}
                      </Typography>
                      {major.fullName && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {major.fullName}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {major.faculty}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {major.duration} năm
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {major.trainingLevel}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={`${major.totalCredits} TC`} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <PeopleIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {major.metadata?.studentCount || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <MenuBookIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {major.metadata?.courseCount || 0}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={major.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        color={major.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(major)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(major._id, major.name)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog Form */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editMode ? 'Chỉnh sửa Ngành' : 'Thêm Ngành mới'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Mã ngành *"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  fullWidth
                  disabled={editMode}
                  helperText="Ví dụ: CNTT, KTXD, KTTM"
                />
                <TextField
                  label="Tên ngành *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>

              <TextField
                label="Tên đầy đủ"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                helperText="Ví dụ: Ngành Công nghệ Thông tin"
              />

              <TextField
                label="Khoa quản lý *"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                fullWidth
                helperText="Ví dụ: Khoa Công nghệ Thông tin"
              />

              <TextField
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Bậc đào tạo"
                  name="trainingLevel"
                  value={formData.trainingLevel}
                  onChange={handleChange}
                  select
                  fullWidth
                >
                  <MenuItem value="Đại học">Đại học</MenuItem>
                  <MenuItem value="Cao đẳng">Cao đẳng</MenuItem>
                  <MenuItem value="Thạc sĩ">Thạc sĩ</MenuItem>
                  <MenuItem value="Tiến sĩ">Tiến sĩ</MenuItem>
                </TextField>

                <TextField
                  label="Thời gian đào tạo (năm)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 2, max: 6 }}
                />

                <TextField
                  label="Tổng số tín chỉ"
                  name="totalCredits"
                  type="number"
                  value={formData.totalCredits}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 90, max: 200 }}
                />

                <TextField
                  label="Năm tuyển sinh"
                  name="admissionYear"
                  type="number"
                  value={formData.admissionYear}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>

              <TextField
                label="Trạng thái"
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
                select
                fullWidth
              >
                <MenuItem value={true}>Hoạt động</MenuItem>
                <MenuItem value={false}>Tạm dừng</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editMode ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MajorManagement;
