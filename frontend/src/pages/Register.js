import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: 5, 
            width: '100%',
            borderRadius: 3,
            border: '1px solid rgba(200, 16, 46, 0.1)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {/* Logo Trường */}
            <Box 
              component="img"
              src={`${process.env.PUBLIC_URL}/images/Logo-dau.png`}
              alt="Logo ĐH Kiến trúc Đà Nẵng"
              onError={(e) => {
                console.error('Logo load error:', e);
                e.target.style.display = 'none';
              }}
              sx={{
                width: 100,
                height: 100,
                margin: '0 auto 20px',
                display: 'block',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 8px rgba(200, 16, 46, 0.2))',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
            
            <Typography 
              component="h1" 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                color: 'primary.main',
                mb: 1,
                letterSpacing: '1px',
                textShadow: '2px 2px 4px rgba(200, 16, 46, 0.1)',
              }}
            >
              LMS-DAU
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              Đăng ký tài khoản
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
              }}
            >
              Trường Đại học Kiến trúc Đà Nẵng
            </Typography>
          </Box>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Họ tên"
              name="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Vai trò</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Vai trò"
                onChange={handleChange}
              >
                <MenuItem value="student">Sinh viên</MenuItem>
                <MenuItem value="teacher">Giảng viên</MenuItem>
              </Select>
            </FormControl>
            {formData.role === 'student' && (
              <TextField
                margin="normal"
                fullWidth
                id="studentId"
                label="Mã sinh viên"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
              />
            )}
            <TextField
              margin="normal"
              fullWidth
              id="department"
              label="Khoa"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Đã có tài khoản? Đăng nhập
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
