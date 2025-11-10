import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Button, Card, CardContent, Grid, Chip,
  IconButton, LinearProgress, Alert
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, PlayArrow as TakeIcon, Visibility as ViewIcon,
  Timer as TimerIcon, Quiz as QuizIcon, CheckCircle as PassIcon
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Quizzes() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    loadQuizzes();
  }, [courseId]);

  const loadQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');

      // Load course info
      const courseRes = await axios.get(
        `http://localhost:5000/api/courses/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(courseRes.data);

      // Load quizzes
      const quizzesRes = await axios.get(
        `http://localhost:5000/api/quizzes/course/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuizzes(quizzesRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Load quizzes error:', error);
      setLoading(false);
    }
  };

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Đang tải danh sách quiz...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Quizzes
            </Typography>
            {course && (
              <Typography variant="body2" color="text.secondary">
                {course.title} ({course.code})
              </Typography>
            )}
          </Box>

          {isTeacher && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/quizzes/new?courseId=${courseId}`)}
            >
              Tạo Quiz mới
            </Button>
          )}
        </Box>

        {/* Quizzes List */}
        {quizzes.length === 0 ? (
          <Alert severity="info">
            {isTeacher
              ? 'Chưa có quiz nào. Nhấn "Tạo Quiz mới" để bắt đầu!'
              : 'Chưa có quiz nào trong khóa học này.'}
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {quizzes.map((quiz) => (
              <Grid item xs={12} key={quiz._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <QuizIcon color="primary" />
                          <Typography variant="h6">{quiz.title}</Typography>
                          <Chip
                            label={quiz.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                            size="small"
                            color={quiz.status === 'published' ? 'success' : 'default'}
                          />
                        </Box>

                        {quiz.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {quiz.description}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Chip
                            icon={<QuizIcon />}
                            label={`${quiz.questions?.length || 0} câu hỏi`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={`${quiz.totalPoints} điểm`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                          {quiz.timeLimit && (
                            <Chip
                              icon={<TimerIcon />}
                              label={`${quiz.timeLimit} phút`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                          <Chip
                            label={`${quiz.maxAttempts} lần làm`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        {/* Student Info */}
                        {!isTeacher && quiz.attemptCount !== undefined && (
                          <Box sx={{ mt: 2 }}>
                            {quiz.attemptCount > 0 ? (
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Đã làm: {quiz.attemptCount}/{quiz.maxAttempts} lần
                                </Typography>
                                {quiz.bestScore !== null && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Typography variant="body2">
                                      Điểm cao nhất: {quiz.bestScore.toFixed(1)}%
                                    </Typography>
                                    {quiz.bestScore >= quiz.passingScore && (
                                      <PassIcon color="success" fontSize="small" />
                                    )}
                                  </Box>
                                )}
                                <LinearProgress
                                  variant="determinate"
                                  value={quiz.bestScore || 0}
                                  color={quiz.bestScore >= quiz.passingScore ? 'success' : 'warning'}
                                  sx={{ mt: 1, height: 6, borderRadius: 1 }}
                                />
                              </Box>
                            ) : (
                              <Alert severity="info" sx={{ py: 0.5 }}>
                                Bạn chưa làm quiz này
                              </Alert>
                            )}
                          </Box>
                        )}
                      </Box>

                      {/* Actions */}
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        {isTeacher ? (
                          <>
                            <Button
                              variant="outlined"
                              startIcon={<EditIcon />}
                              onClick={() => navigate(`/quizzes/${quiz._id}/edit`)}
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={<ViewIcon />}
                              onClick={() => navigate(`/quizzes/${quiz._id}/attempts`)}
                            >
                              Xem bài làm
                            </Button>
                          </>
                        ) : (
                          <>
                            {quiz.canAttempt ? (
                              <Button
                                variant="contained"
                                startIcon={<TakeIcon />}
                                onClick={() => navigate(`/quizzes/${quiz._id}/take`)}
                              >
                                {quiz.attemptCount > 0 ? 'Làm lại' : 'Bắt đầu'}
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                startIcon={<ViewIcon />}
                                onClick={() => navigate(`/quizzes/${quiz._id}/my-attempts`)}
                              >
                                Xem kết quả
                              </Button>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}

export default Quizzes;
