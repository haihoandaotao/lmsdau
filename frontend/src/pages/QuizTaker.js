import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Button, Radio, RadioGroup, FormControlLabel,
  TextField, Checkbox, LinearProgress, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip, Grid, Card, CardContent, Snackbar
} from '@mui/material';
import {
  Timer as TimerIcon, CheckCircle as CheckIcon, Warning as WarningIcon,
  NavigateBefore as PrevIcon, NavigateNext as NextIcon
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function QuizTaker() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const timerRef = useRef(null);

  useEffect(() => {
    startQuizAttempt();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (attempt && quiz?.timeLimit) {
      const startTime = new Date(attempt.startedAt).getTime();
      const timeLimitMs = quiz.timeLimit * 60 * 1000;

      const updateTimer = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const remaining = Math.max(0, timeLimitMs - elapsed);

        setTimeRemaining(Math.floor(remaining / 1000));

        if (remaining === 0) {
          handleSubmit(true); // Auto-submit when time's up
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [attempt, quiz]);

  const startQuizAttempt = async () => {
    try {
      const token = localStorage.getItem('token');

      // Start attempt
      const response = await axios.post(
        `http://localhost:5000/api/quizzes/${quizId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAttempt(response.data.attempt);
      setQuiz(response.data);

      // Initialize answers
      const initialAnswers = {};
      response.data.attempt.questionsSnapshot.forEach(q => {
        initialAnswers[q._id] = null;
      });
      setAnswers(initialAnswers);

      setLoading(false);
    } catch (error) {
      console.error('Start quiz error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Không thể bắt đầu quiz',
        severity: 'error'
      });

      setTimeout(() => {
        navigate(`/courses/${quiz?.course}`);
      }, 2000);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      setConfirmDialogOpen(true);
      return;
    }

    try {
      setSubmitting(true);
      setConfirmDialogOpen(false);

      if (timerRef.current) clearInterval(timerRef.current);

      // Format answers
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      const token = localStorage.getItem('token');

      const response = await axios.post(
        `http://localhost:5000/api/quizzes/attempts/${attempt._id}/submit`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({
        open: true,
        message: autoSubmit ? 'Hết giờ! Bài đã được nộp tự động' : 'Nộp bài thành công!',
        severity: 'success'
      });

      setTimeout(() => {
        navigate(`/quizzes/attempts/${response.data.attempt._id}`);
      }, 1500);
    } catch (error) {
      console.error('Submit quiz error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi nộp bài',
        severity: 'error'
      });
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(a => a !== null && a !== '').length;
  };

  const renderQuestion = (question) => {
    const answer = answers[question._id];

    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          >
            {question.options?.map((option, idx) => (
              <FormControlLabel
                key={idx}
                value={option.text}
                control={<Radio />}
                label={option.text}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  mb: 1,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              />
            ))}
          </RadioGroup>
        );

      case 'true_false':
        return (
          <RadioGroup
            value={answer !== null ? answer.toString() : ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value === 'true')}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="Đúng"
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                px: 2,
                py: 1,
                mb: 1
              }}
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Sai"
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                px: 2,
                py: 1
              }}
            />
          </RadioGroup>
        );

      case 'short_answer':
      case 'fill_blank':
        return (
          <TextField
            fullWidth
            multiline={question.type === 'short_answer'}
            rows={question.type === 'short_answer' ? 3 : 1}
            placeholder="Nhập câu trả lời của bạn..."
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          />
        );

      case 'essay':
        return (
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Nhập câu trả lời của bạn..."
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Đang tải quiz...</Typography>
        </Paper>
      </Container>
    );
  }

  if (!attempt || !quiz) {
    return null;
  }

  const questions = attempt.questionsSnapshot;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = (getAnsweredCount() / questions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5">{quiz.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Lần làm bài thứ {attempt.attemptNumber}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
            {quiz.timeLimit && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { md: 'flex-end' }, gap: 1 }}>
                <TimerIcon color={timeRemaining < 60 ? 'error' : 'primary'} />
                <Typography
                  variant="h6"
                  color={timeRemaining < 60 ? 'error' : 'primary'}
                >
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Đã trả lời: {getAnsweredCount()}/{questions.length}
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mt: 0.5 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Question Navigation */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" gutterBottom>Câu hỏi:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {questions.map((q, idx) => {
            const isAnswered = answers[q._id] !== null && answers[q._id] !== '';
            return (
              <Chip
                key={q._id}
                label={idx + 1}
                onClick={() => setCurrentQuestionIndex(idx)}
                color={idx === currentQuestionIndex ? 'primary' : 'default'}
                variant={isAnswered ? 'filled' : 'outlined'}
                icon={isAnswered ? <CheckIcon /> : undefined}
              />
            );
          })}
        </Box>
      </Paper>

      {/* Question */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip label={`Câu ${currentQuestionIndex + 1}/${questions.length}`} />
          <Chip
            label={`${currentQuestion.points} điểm`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          {currentQuestion.question}
        </Typography>

        {renderQuestion(currentQuestion)}

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            startIcon={<PrevIcon />}
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            Câu trước
          </Button>

          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              endIcon={<NextIcon />}
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              variant="contained"
            >
              Câu sau
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              Nộp bài
            </Button>
          )}
        </Box>
      </Paper>

      {/* Warning if not all answered */}
      {getAnsweredCount() < questions.length && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Bạn còn <strong>{questions.length - getAnsweredCount()} câu</strong> chưa trả lời
          </Typography>
        </Alert>
      )}

      {/* Confirm Submit Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Xác nhận nộp bài</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn đã trả lời <strong>{getAnsweredCount()}/{questions.length}</strong> câu hỏi.
          </Typography>
          {getAnsweredCount() < questions.length && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Còn {questions.length - getAnsweredCount()} câu chưa trả lời!
            </Alert>
          )}
          <Typography sx={{ mt: 2 }}>
            Bạn có chắc chắn muốn nộp bài không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit(true)}
            disabled={submitting}
          >
            Xác nhận nộp
          </Button>
        </DialogActions>
      </Dialog>

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

export default QuizTaker;
