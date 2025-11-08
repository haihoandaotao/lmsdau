import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    major: '',
    year: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setProfile(data.data);
      setFormData({
        name: data.data.name || '',
        email: data.data.email || '',
        studentId: data.data.studentId || '',
        major: data.data.major || '',
        year: data.data.year || '',
        bio: data.data.bio || ''
      });
    } catch (error) {
      toast.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await api.put('/users/profile', formData);
      toast.success('Cập nhật hồ sơ thành công!');
      setEditing(false);
      await refreshUser();
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      studentId: profile.studentId || '',
      major: profile.major || '',
      year: profile.year || '',
      bio: profile.bio || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="text" height={60} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="circular" width={120} height={120} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">Không thể tải thông tin hồ sơ</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Hồ sơ cá nhân"
        subtitle="Quản lý thông tin cá nhân của bạn"
      />

      <Grid container spacing={4}>
        {/* Profile Avatar and Basic Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                {profile.name?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography variant="h5" gutterBottom>
                {profile.name}
              </Typography>

              <Chip
                label={profile.role === 'student' ? 'Sinh viên' : 'Giảng viên'}
                color={profile.role === 'student' ? 'primary' : 'secondary'}
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profile.email}
              </Typography>

              {profile.studentId && (
                <Typography variant="body2" color="text.secondary">
                  MSSV: {profile.studentId}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                Tham gia: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Thông tin chi tiết
                </Typography>

                {!editing ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                    >
                      Lưu
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                    >
                      Hủy
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>

                {user.role === 'student' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mã sinh viên"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Chuyên ngành"
                        name="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        disabled={!editing}
                        InputProps={{
                          startAdornment: <SchoolIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth disabled={!editing}>
                        <InputLabel>Năm học</InputLabel>
                        <Select
                          name="year"
                          value={formData.year}
                          label="Năm học"
                          onChange={handleInputChange}
                        >
                          <MenuItem value="">Chọn năm học</MenuItem>
                          <MenuItem value="1">Năm 1</MenuItem>
                          <MenuItem value="2">Năm 2</MenuItem>
                          <MenuItem value="3">Năm 3</MenuItem>
                          <MenuItem value="4">Năm 4</MenuItem>
                          <MenuItem value="5">Năm 5</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Giới thiệu bản thân"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Hãy viết một chút về bản thân bạn..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê hoạt động
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {profile.stats?.enrolledCourses || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Khóa học
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary">
                      {profile.stats?.completedAssignments || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bài tập
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {profile.stats?.forumPosts || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bài viết
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {profile.stats?.forumComments || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bình luận
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
