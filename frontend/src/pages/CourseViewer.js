import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Tabs,
  Tab,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  PlayCircleOutline,
  ExpandLess,
  ExpandMore,
  CheckCircle,
  Lock,
  Description,
  Quiz,
  Assignment as AssignmentIcon,
  Forum,
  MenuBook,
  ArrowBack
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courseProgress, setCourseProgress] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch course details
      const courseRes = await axios.get(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(courseRes.data.data);
      
      // Fetch modules
      const modulesRes = await axios.get(`/api/modules/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(modulesRes.data.data);
      
      // Fetch progress
      try {
        const progressRes = await axios.get(`/api/video-progress/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourseProgress(progressRes.data.data);
      } catch (err) {
        console.log('No progress data yet');
      }
      
      // Auto-select first video item
      if (modulesRes.data.data.length > 0) {
        const firstModule = modulesRes.data.data[0];
        if (firstModule.items && firstModule.items.length > 0) {
          setCurrentModule(firstModule);
          setCurrentItem(firstModule.items[0]);
          setExpandedModules({ [firstModule._id]: true });
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải khóa học');
      setLoading(false);
    }
  };

  const handleModuleClick = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleItemClick = async (module, item) => {
    // Check if item is locked
    if (module.unlockCondition === 'sequential' && item.order > 1) {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `/api/video-progress/check-unlock/${module._id}/${item._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (!res.data.data.isUnlocked) {
          alert(res.data.data.message || 'Nội dung này chưa được mở khóa');
          return;
        }
      } catch (err) {
        console.error('Error checking unlock status:', err);
      }
    }
    
    setCurrentModule(module);
    setCurrentItem(item);
  };

  const handleProgress = (progressData) => {
    // Update local progress display
    console.log('Progress:', progressData);
  };

  const getItemIcon = (type, progress) => {
    if (progress?.isCompleted) {
      return <CheckCircle sx={{ color: '#4caf50' }} />;
    }
    
    switch (type) {
      case 'video':
        return <PlayCircleOutline />;
      case 'reading':
        return <Description />;
      case 'quiz':
        return <Quiz />;
      case 'assignment':
        return <AssignmentIcon />;
      case 'discussion':
        return <Forum />;
      default:
        return <MenuBook />;
    }
  };

  const renderContent = () => {
    if (!currentItem) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Chọn một bài học để bắt đầu
          </Typography>
        </Box>
      );
    }

    switch (currentItem.type) {
      case 'video':
        return (
          <Box>
            <VideoPlayer
              videoUrl={currentItem.content}
              itemId={currentItem._id}
              courseId={courseId}
              moduleId={currentModule._id}
              startTime={currentItem.progress?.currentTime || 0}
              onProgress={handleProgress}
            />
            
            {currentItem.description && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body1">
                  {currentItem.description}
                </Typography>
              </Box>
            )}
          </Box>
        );
      
      case 'reading':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              {currentItem.title}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {currentItem.content}
            </Typography>
          </Box>
        );
      
      case 'quiz':
        return (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {currentItem.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {currentItem.description}
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate(`/assignments/${currentItem.content}`)}
              >
                Bắt đầu làm bài kiểm tra
              </Button>
            </CardContent>
          </Card>
        );
      
      case 'assignment':
        return (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {currentItem.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {currentItem.description}
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate(`/assignments/${currentItem.content}`)}
              >
                Xem bài tập
              </Button>
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <Box sx={{ p: 2 }}>
            <Typography>Nội dung không được hỗ trợ</Typography>
          </Box>
        );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 0, borderRadius: 0 }} elevation={1}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/student-dashboard')}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {course?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {course?.code}
              </Typography>
            </Box>
            {courseProgress && (
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tiến độ: {courseProgress.completionPercentage}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={courseProgress.completionPercentage} 
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Sidebar - Course Modules */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h6">Nội dung khóa học</Typography>
              </Box>
              
              <List>
                {modules.map((module, index) => (
                  <React.Fragment key={module._id}>
                    <ListItemButton onClick={() => handleModuleClick(module._id)}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {index + 1}. {module.title}
                          </Typography>
                        }
                        secondary={`${module.itemCount} mục`}
                      />
                      {expandedModules[module._id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    
                    <Collapse in={expandedModules[module._id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {module.items.map((item, itemIndex) => {
                          const isActive = currentItem?._id === item._id;
                          const progress = item.progress;
                          
                          return (
                            <ListItemButton
                              key={item._id}
                              sx={{ pl: 4, bgcolor: isActive ? 'action.selected' : 'transparent' }}
                              onClick={() => handleItemClick(module, item)}
                            >
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {getItemIcon(item.type, progress)}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    {item.title}
                                  </Typography>
                                }
                                secondary={
                                  progress?.watchedPercentage > 0 && progress?.watchedPercentage < 100
                                    ? `${Math.round(progress.watchedPercentage)}%`
                                    : null
                                }
                              />
                              {item.duration && (
                                <Chip
                                  label={`${item.duration} phút`}
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ minHeight: 'calc(100vh - 200px)' }}>
              {/* Content Header */}
              {currentItem && (
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h5" gutterBottom>
                    {currentItem.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label={currentItem.type === 'video' ? 'Video' : 
                             currentItem.type === 'reading' ? 'Bài đọc' :
                             currentItem.type === 'quiz' ? 'Bài kiểm tra' :
                             currentItem.type === 'assignment' ? 'Bài tập' : 'Khác'}
                      size="small"
                      color="primary"
                    />
                    {currentItem.duration && (
                      <Chip label={`${currentItem.duration} phút`} size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>
              )}

              {/* Tabs */}
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                <Tab label="Nội dung" />
                <Tab label="Tổng quan" />
                <Tab label="Tài nguyên" />
                <Tab label="Thảo luận" />
              </Tabs>

              {/* Tab Content */}
              <Box sx={{ p: 3 }}>
                {tabValue === 0 && renderContent()}
                
                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Tổng quan khóa học</Typography>
                    <Typography variant="body1" paragraph>{course?.description}</Typography>
                    
                    {currentModule && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Mục tiêu học tập</Typography>
                        <List>
                          {currentModule.learningObjectives?.map((obj, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <CheckCircle color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={obj} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </Box>
                )}
                
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Tài nguyên</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chưa có tài nguyên nào
                    </Typography>
                  </Box>
                )}
                
                {tabValue === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Thảo luận</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Khu vực thảo luận đang được phát triển
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseViewer;
