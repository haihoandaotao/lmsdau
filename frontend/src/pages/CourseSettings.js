import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, TextField, Button, Tabs, Tab, Grid,
  FormControl, InputLabel, Select, MenuItem, IconButton, Snackbar, Alert,
  Divider, Card, CardContent, Switch, FormControlLabel, Chip
} from '@mui/material';
import {
  ArrowBack as BackIcon, Save as SaveIcon, Add as AddIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ paddingTop: 24 }}>
      {value === index && children}
    </div>
  );
}

function CourseSettings() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [course, setCourse] = useState(null);
  const [settings, setSettings] = useState({
    syllabus: '',
    objectives: [''],
    courseFormat: 'topics',
    startDate: '',
    endDate: '',
    gradingScheme: {
      scale: 'percentage',
      passingGrade: 50,
      weights: {
        assignments: 30,
        quizzes: 30,
        midterm: 20,
        final: 20
      },
      letterGrades: [
        { letter: 'A', minPercentage: 90, maxPercentage: 100 },
        { letter: 'B+', minPercentage: 85, maxPercentage: 89 },
        { letter: 'B', minPercentage: 80, maxPercentage: 84 },
        { letter: 'C+', minPercentage: 75, maxPercentage: 79 },
        { letter: 'C', minPercentage: 70, maxPercentage: 74 },
        { letter: 'D+', minPercentage: 65, maxPercentage: 69 },
        { letter: 'D', minPercentage: 60, maxPercentage: 64 },
        { letter: 'F', minPercentage: 0, maxPercentage: 59 }
      ]
    },
    accessSettings: {
      enrollmentKey: '',
      allowGuestAccess: false,
      visibility: 'public'
    }
  });

  useEffect(() => {
    loadCourseSettings();
  }, [courseId]);

  const loadCourseSettings = async () => {
    try {
      const token = localStorage.getItem('token');

      // Load course info
      const courseRes = await axios.get(
        `http://localhost:5000/api/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(courseRes.data);

      // Load settings
      const settingsRes = await axios.get(
        `http://localhost:5000/api/courses/${courseId}/settings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = settingsRes.data.data;

      setSettings({
        syllabus: data.syllabus || '',
        objectives: data.objectives?.length > 0 ? data.objectives : [''],
        courseFormat: data.courseFormat || 'topics',
        startDate: data.startDate ? data.startDate.split('T')[0] : '',
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
        gradingScheme: data.gradingScheme || settings.gradingScheme,
        accessSettings: data.accessSettings || settings.accessSettings
      });

      setLoading(false);
    } catch (error) {
      console.error('Load settings error:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải cài đặt khóa học',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:5000/api/courses/${courseId}/settings`,
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({
        open: true,
        message: 'Lưu cài đặt thành công!',
        severity: 'success'
      });

      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 1500);
    } catch (error) {
      console.error('Save settings error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi lưu cài đặt',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleObjectiveChange = (index, value) => {
    const updated = [...settings.objectives];
    updated[index] = value;
    setSettings({ ...settings, objectives: updated });
  };

  const addObjective = () => {
    setSettings({
      ...settings,
      objectives: [...settings.objectives, '']
    });
  };

  const removeObjective = (index) => {
    const updated = settings.objectives.filter((_, i) => i !== index);
    setSettings({ ...settings, objectives: updated });
  };

  const handleWeightChange = (field, value) => {
    setSettings({
      ...settings,
      gradingScheme: {
        ...settings.gradingScheme,
        weights: {
          ...settings.gradingScheme.weights,
          [field]: parseFloat(value) || 0
        }
      }
    });
  };

  const getTotalWeight = () => {
    const weights = settings.gradingScheme.weights;
    return weights.assignments + weights.quizzes + weights.midterm + weights.final;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Đang tải cài đặt...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate(`/courses/${courseId}`)}>
              <BackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4">Cài đặt Khóa học</Typography>
              {course && (
                <Typography variant="body2" color="text.secondary">
                  {course.title} ({course.code})
                </Typography>
              )}
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
          >
            Lưu thay đổi
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Tabs */}
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
          <Tab label="Thông tin chung" />
          <Tab label="Đề cương (Syllabus)" />
          <Tab label="Thang điểm" />
          <Tab label="Truy cập" />
        </Tabs>

        {/* Tab 1: General Info */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Định dạng khóa học</InputLabel>
                <Select
                  value={settings.courseFormat}
                  label="Định dạng khóa học"
                  onChange={(e) => setSettings({ ...settings, courseFormat: e.target.value })}
                >
                  <MenuItem value="topics">Theo chủ đề</MenuItem>
                  <MenuItem value="weekly">Theo tuần</MenuItem>
                  <MenuItem value="social">Diễn đàn xã hội</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Empty for layout */}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Ngày bắt đầu"
                value={settings.startDate}
                onChange={(e) => setSettings({ ...settings, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Ngày kết thúc"
                value={settings.endDate}
                onChange={(e) => setSettings({ ...settings, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Mục tiêu học tập</Typography>
              {settings.objectives.map((obj, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder={`Mục tiêu ${index + 1}`}
                    value={obj}
                    onChange={(e) => handleObjectiveChange(index, e.target.value)}
                    multiline
                    rows={2}
                  />
                  <IconButton
                    onClick={() => removeObjective(index)}
                    disabled={settings.objectives.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addObjective}
                variant="outlined"
              >
                Thêm mục tiêu
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Syllabus */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Đề cương chi tiết của khóa học (hỗ trợ định dạng rich text)
          </Typography>
          <ReactQuill
            theme="snow"
            value={settings.syllabus}
            onChange={(value) => setSettings({ ...settings, syllabus: value })}
            style={{ height: 400, marginBottom: 60 }}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </TabPanel>

        {/* Tab 3: Grading Scheme */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Thang điểm</InputLabel>
                <Select
                  value={settings.gradingScheme.scale}
                  label="Thang điểm"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      gradingScheme: { ...settings.gradingScheme, scale: e.target.value }
                    })
                  }
                >
                  <MenuItem value="percentage">Phần trăm (%)</MenuItem>
                  <MenuItem value="points">Điểm số</MenuItem>
                  <MenuItem value="letter">Chữ cái</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Điểm đạt (%)"
                value={settings.gradingScheme.passingGrade}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    gradingScheme: {
                      ...settings.gradingScheme,
                      passingGrade: parseFloat(e.target.value)
                    }
                  })
                }
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tỷ trọng điểm
              </Typography>
              <Card variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Bài tập (%)"
                        value={settings.gradingScheme.weights.assignments}
                        onChange={(e) => handleWeightChange('assignments', e.target.value)}
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Quiz (%)"
                        value={settings.gradingScheme.weights.quizzes}
                        onChange={(e) => handleWeightChange('quizzes', e.target.value)}
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Giữa kỳ (%)"
                        value={settings.gradingScheme.weights.midterm}
                        onChange={(e) => handleWeightChange('midterm', e.target.value)}
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Cuối kỳ (%)"
                        value={settings.gradingScheme.weights.final}
                        onChange={(e) => handleWeightChange('final', e.target.value)}
                        inputProps={{ min: 0, max: 100 }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Tổng tỷ trọng:</Typography>
                    <Chip
                      label={`${getTotalWeight()}%`}
                      color={getTotalWeight() === 100 ? 'success' : 'error'}
                    />
                  </Box>
                  {getTotalWeight() !== 100 && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      Tổng tỷ trọng phải bằng 100%
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {settings.gradingScheme.scale === 'letter' && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Thang điểm chữ
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={1}>
                      {settings.gradingScheme.letterGrades.map((grade, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip label={grade.letter} color="primary" />
                            <Typography variant="body2">
                              {grade.minPercentage}% - {grade.maxPercentage}%
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Tab 4: Access Settings */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Chế độ hiển thị</InputLabel>
                <Select
                  value={settings.accessSettings.visibility}
                  label="Chế độ hiển thị"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      accessSettings: { ...settings.accessSettings, visibility: e.target.value }
                    })
                  }
                >
                  <MenuItem value="public">Công khai</MenuItem>
                  <MenuItem value="private">Riêng tư</MenuItem>
                  <MenuItem value="hidden">Ẩn</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mã ghi danh (tùy chọn)"
                value={settings.accessSettings.enrollmentKey}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    accessSettings: { ...settings.accessSettings, enrollmentKey: e.target.value }
                  })
                }
                placeholder="Để trống nếu không yêu cầu mã"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.accessSettings.allowGuestAccess}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        accessSettings: {
                          ...settings.accessSettings,
                          allowGuestAccess: e.target.checked
                        }
                      })
                    }
                  />
                }
                label="Cho phép khách truy cập (chỉ xem)"
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Công khai:</strong> Hiển thị trong danh sách khóa học, ai cũng có thể ghi danh
                </Typography>
                <Typography variant="body2">
                  <strong>Riêng tư:</strong> Chỉ sinh viên được thêm vào mới thấy
                </Typography>
                <Typography variant="body2">
                  <strong>Ẩn:</strong> Không hiển thị trong danh sách, chỉ truy cập qua link
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CourseSettings;
