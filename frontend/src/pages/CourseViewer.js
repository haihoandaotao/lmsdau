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
import EnhancedVideoPlayer from '../components/EnhancedVideoPlayer';
import ProgressDashboard from '../components/ProgressDashboard';
import QuickQuiz from '../components/QuickQuiz';

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
  const [showQuiz, setShowQuiz] = useState(false);
  const [completions, setCompletions] = useState({});
  const [resources, setResources] = useState([]);

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
      
      // Fetch item completions
      try {
        const completionRes = await axios.get(`/api/item-completion/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const completionMap = {};
        completionRes.data.data.forEach(comp => {
          completionMap[comp.item] = comp;
        });
        setCompletions(completionMap);
      } catch (err) {
        console.log('No completion data yet');
      }
      
      // Fetch resources
      try {
        const resourcesRes = await axios.get(`/api/resources/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResources(resourcesRes.data.data);
      } catch (err) {
        console.log('No resources yet');
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
    // Check if previous item is completed (sequential learning)
    if (item.order > 1) {
      const previousItem = module.items.find(i => i.order === item.order - 1);
      if (previousItem && !completions[previousItem._id]?.completed) {
        alert(`Bạn cần hoàn thành "${previousItem.title}" trước khi xem bài này!`);
        return;
      }
    }
    
    setCurrentModule(module);
    setCurrentItem(item);
    setShowQuiz(false);
  };

  const handleProgress = (progressData) => {
    // Update local progress display
    console.log('Progress:', progressData);
  };

  const handleQuizPass = async (quizScore) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/item-completion/complete', {
        itemId: currentItem._id,
        moduleId: currentModule._id,
        courseId: courseId,
        quizScore
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reload completions
      const completionRes = await axios.get(`/api/item-completion/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const completionMap = {};
      completionRes.data.data.forEach(comp => {
        completionMap[comp.item] = comp;
      });
      setCompletions(completionMap);
    } catch (err) {
      console.error('Error saving completion:', err);
    }
  };

  const getItemIcon = (type, progress) => {
    // Check completion status
    if (completions[progress?._id || '']?.completed) {
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
        console.log('Rendering video:', currentItem.videoUrl);
        
        // Generate quiz questions based on item
        const quizQuestions = [
          {
            question: `Bạn đã hiểu nội dung chính của "${currentItem.title}" chưa?`,
            options: [
              'Đã hiểu hoàn toàn',
              'Hiểu một phần',
              'Chưa hiểu',
              'Cần xem lại'
            ],
            correctAnswer: 'Đã hiểu hoàn toàn',
            explanation: 'Tuyệt vời! Hãy tiếp tục học tập.'
          },
          {
            question: 'Bạn có thể áp dụng kiến thức này vào thực tế không?',
            options: [
              'Có, hoàn toàn có thể',
              'Có, nhưng cần luyện tập thêm',
              'Chưa thể',
              'Không chắc chắn'
            ],
            correctAnswer: 'Có, hoàn toàn có thể',
            explanation: 'Thực hành nhiều sẽ giúp bạn thành thạo hơn!'
          },
          {
            question: 'Bạn cảm thấy video này có hữu ích không?',
            options: [
              'Rất hữu ích',
              'Khá hữu ích',
              'Bình thường',
              'Không hữu ích'
            ],
            correctAnswer: 'Rất hữu ích',
            explanation: 'Cảm ơn feedback của bạn!'
          }
        ];
        
        if (showQuiz) {
          return <QuickQuiz questions={quizQuestions} onPass={handleQuizPass} itemId={currentItem._id} />;
        }
        
        const isCompleted = completions[currentItem._id]?.completed;
        
        return (
          <Box>
            {!currentItem.videoUrl ? (
              <Alert severity="warning">Video URL không tồn tại</Alert>
            ) : (
              <EnhancedVideoPlayer
                videoUrl={currentItem.videoUrl}
                itemId={currentItem._id}
                courseId={courseId}
                moduleId={currentModule._id}
                startTime={currentItem.progress?.currentTime || 0}
                onProgress={handleProgress}
              />
            )}
            
            {/* Quiz Button */}
            {!isCompleted && (
              <Paper sx={{ p: 3, mt: 3, bgcolor: '#e3f2fd', border: 2, borderColor: '#2196f3' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                  📝 Kiểm Tra Nhanh
                </Typography>
                <Typography variant="body1" paragraph>
                  Hoàn thành bài kiểm tra nhanh để mở khóa bài học tiếp theo.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => setShowQuiz(true)}
                  sx={{ fontWeight: 600 }}
                >
                  Làm Bài Kiểm Tra
                </Button>
              </Paper>
            )}
            
            {isCompleted && (
              <Alert severity="success" sx={{ mt: 3 }}>
                <strong>✅ Đã hoàn thành!</strong> Bạn đã đạt {completions[currentItem._id]?.quizScore}% trong bài kiểm tra.
              </Alert>
            )}
            
            {currentItem.description && (
              <Box sx={{ mt: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  📝 Về video này
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  {currentItem.description}
                </Typography>
              </Box>
            )}
            
            {currentItem.videoDuration && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ⏱️ Thời lượng: {Math.floor(currentItem.videoDuration / 60)} phút {currentItem.videoDuration % 60} giây
                </Typography>
              </Box>
            )}
          </Box>
        );
      
      case 'reading':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              {currentItem.title}
            </Typography>
            {currentItem.description && (
              <Typography variant="body1" color="text.secondary" paragraph>
                {currentItem.description}
              </Typography>
            )}
            <Divider sx={{ my: 3 }} />
            <Box 
              sx={{ 
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  fontFamily: 'inherit',
                  marginTop: '1.5em',
                  marginBottom: '0.5em'
                },
                '& p': {
                  marginBottom: '1em',
                  lineHeight: 1.8
                },
                '& ul, & ol': {
                  marginBottom: '1em',
                  paddingLeft: '2em'
                },
                '& li': {
                  marginBottom: '0.5em'
                },
                '& pre': {
                  backgroundColor: '#2c3e50',
                  color: '#ecf0f1',
                  padding: '1em',
                  borderRadius: '5px',
                  overflow: 'auto',
                  marginBottom: '1em'
                },
                '& code': {
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '0.9em'
                },
                '& table': {
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginBottom: '1em'
                },
                '& th, & td': {
                  padding: '0.75em',
                  border: '1px solid #ddd',
                  textAlign: 'left'
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto'
                }
              }}
              dangerouslySetInnerHTML={{ __html: currentItem.content }}
            />
            {currentItem.readingTime && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ⏱️ Thời gian đọc: khoảng {currentItem.readingTime} phút
                </Typography>
              </Box>
            )}
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
                          const isCompleted = completions[item._id]?.completed;
                          const isLocked = item.order > 1 && module.items.find(i => i.order === item.order - 1) && !completions[module.items.find(i => i.order === item.order - 1)?._id]?.completed;
                          
                          return (
                            <ListItemButton
                              key={item._id}
                              sx={{ 
                                pl: 4, 
                                bgcolor: isActive ? 'action.selected' : 'transparent',
                                opacity: isLocked ? 0.5 : 1
                              }}
                              onClick={() => handleItemClick(module, item)}
                              disabled={isLocked}
                            >
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {isLocked ? <Lock color="disabled" /> : getItemIcon(item.type, item)}
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    {item.title}
                                    {isCompleted && ' ✓'}
                                  </Typography>
                                }
                                secondary={
                                  isLocked ? 'Chưa mở khóa' : null
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
                <Tab label="📊 Progress" />
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
                  <ProgressDashboard courseId={courseId} />
                )}
                
                {tabValue === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      📎 Tài Nguyên & File
                    </Typography>
                    
                    {resources.length === 0 ? (
                      <Alert severity="info">
                        Chưa có tài nguyên nào cho khóa học này.
                      </Alert>
                    ) : (
                      <Grid container spacing={2}>
                        {resources.map((resource) => (
                          <Grid item xs={12} sm={6} md={4} key={resource._id}>
                            <Card>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Description color="primary" />
                                  <Typography variant="h6" noWrap sx={{ fontWeight: 600, flexGrow: 1 }}>
                                    {resource.name}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={resource.type.toUpperCase()}
                                  size="small"
                                  color="primary"
                                  sx={{ mb: 1 }}
                                />
                                {resource.description && (
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {resource.description}
                                  </Typography>
                                )}
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="caption" color="text.secondary" display="block">
                                  📦 Kích thước: {(resource.fileSize / 1024 / 1024).toFixed(2)} MB
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  📥 Tải xuống: {resource.downloadCount} lần
                                </Typography>
                                {resource.uploadedBy && (
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    👤 Đăng bởi: {resource.uploadedBy.name}
                                  </Typography>
                                )}
                              </CardContent>
                              <Divider />
                              <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  href={resource.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  fullWidth
                                  onClick={async () => {
                                    try {
                                      const token = localStorage.getItem('token');
                                      await axios.put(
                                        `/api/resources/${resource._id}/download`,
                                        {},
                                        { headers: { Authorization: `Bearer ${token}` } }
                                      );
                                    } catch (err) {
                                      console.error('Error updating download count:', err);
                                    }
                                  }}
                                >
                                  📥 Tải xuống
                                </Button>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}
                
                {tabValue === 4 && (
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
