import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Button, Chip, Grid, Card, CardContent,
  Alert, Divider, IconButton, CircularProgress, LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckIcon, Cancel as WrongIcon, HelpOutline as UnansweredIcon,
  ArrowBack as BackIcon, Grade as GradeIcon
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function QuizResults() {
  const navigate = useNavigate();
  const { attemptId } = useParams();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  useEffect(() => {
    loadAttemptDetails();
  }, [attemptId]);

  const loadAttemptDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/quizzes/attempts/${attemptId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAttempt(response.data);

      // Check if we should show correct answers
      const quiz = response.data.quiz;
      const shouldShow =
        quiz.showCorrectAnswers &&
        (quiz.showAnswersAfter === 'immediate' ||
          (quiz.showAnswersAfter === 'after_due' && new Date() > new Date(quiz.dueDate)));

      setShowCorrectAnswers(shouldShow);
      setLoading(false);
    } catch (error) {
      console.error('Load attempt error:', error);
      setLoading(false);
    }
  };

  const getQuestionById = (questionId) => {
    return attempt.questionsSnapshot.find(q => q._id === questionId);
  };

  const getAnswerForQuestion = (questionId) => {
    return attempt.answers.find(a => a.questionId === questionId);
  };

  const renderAnswerStatus = (answer, question) => {
    if (question.type === 'essay') {
      if (answer.gradedAt) {
        return (
          <Chip
            icon={answer.pointsAwarded > 0 ? <CheckIcon /> : <WrongIcon />}
            label={`${answer.pointsAwarded}/${question.points} điểm`}
            color={answer.pointsAwarded > 0 ? 'success' : 'error'}
            size="small"
          />
        );
      }
      return (
        <Chip
          icon={<UnansweredIcon />}
          label="Đang chờ chấm"
          color="warning"
          size="small"
        />
      );
    }

    if (answer.isCorrect === true) {
      return (
        <Chip
          icon={<CheckIcon />}
          label={`Đúng - ${answer.pointsAwarded}/${question.points} điểm`}
          color="success"
          size="small"
        />
      );
    } else if (answer.isCorrect === false) {
      return (
        <Chip
          icon={<WrongIcon />}
          label={`Sai - 0/${question.points} điểm`}
          color="error"
          size="small"
        />
      );
    }

    return (
      <Chip
        icon={<UnansweredIcon />}
        label="Không trả lời"
        color="default"
        size="small"
      />
    );
  };

  const renderQuestionReview = (question, index) => {
    const answer = getAnswerForQuestion(question._id);

    if (!answer) return null;

    const isCorrect = answer.isCorrect;
    const isEssay = question.type === 'essay';

    return (
      <Card
        key={question._id}
        sx={{
          mb: 2,
          border: 2,
          borderColor: isEssay
            ? 'grey.300'
            : isCorrect
            ? 'success.light'
            : 'error.light'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Câu {index + 1}</Typography>
            {renderAnswerStatus(answer, question)}
          </Box>

          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            {question.question}
          </Typography>

          {/* Student's Answer */}
          <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Câu trả lời của bạn:
            </Typography>

            {question.type === 'multiple_choice' && (
              <Typography>{answer.answer || <em>Không trả lời</em>}</Typography>
            )}

            {question.type === 'true_false' && (
              <Typography>{answer.answer === true ? 'Đúng' : answer.answer === false ? 'Sai' : <em>Không trả lời</em>}</Typography>
            )}

            {['short_answer', 'fill_blank', 'essay'].includes(question.type) && (
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {answer.answer || <em>Không trả lời</em>}
              </Typography>
            )}
          </Paper>

          {/* Correct Answer (if allowed) */}
          {showCorrectAnswers && !isEssay && (
            <Paper sx={{ p: 2, bgcolor: 'success.50', mb: 2 }}>
              <Typography variant="subtitle2" color="success.dark" gutterBottom>
                Đáp án đúng:
              </Typography>

              {question.type === 'multiple_choice' && (
                <Typography>
                  {question.options?.find(opt => opt.isCorrect)?.text}
                </Typography>
              )}

              {question.type === 'true_false' && (
                <Typography>{question.correctAnswer ? 'Đúng' : 'Sai'}</Typography>
              )}

              {['short_answer', 'fill_blank'].includes(question.type) && (
                <Box>
                  {question.acceptedAnswers?.map((ans, idx) => (
                    <Chip key={idx} label={ans} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              )}
            </Paper>
          )}

          {/* Explanation */}
          {showCorrectAnswers && question.explanation && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Giải thích:</Typography>
              <Typography variant="body2">{question.explanation}</Typography>
            </Alert>
          )}

          {/* Teacher Feedback for Essays */}
          {isEssay && answer.feedback && (
            <Alert severity="success">
              <Typography variant="subtitle2" gutterBottom>Nhận xét của giáo viên:</Typography>
              <Typography variant="body2">{answer.feedback}</Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải kết quả...</Typography>
      </Container>
    );
  }

  if (!attempt) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Không tìm thấy bài làm</Alert>
      </Container>
    );
  }

  const percentageColor = attempt.passed ? 'success' : 'error';

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={() => navigate(-1)}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4">Kết quả Quiz</Typography>
      </Box>

      {/* Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              {attempt.quiz.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`Lần làm bài ${attempt.attemptNumber}`}
                size="small"
              />
              <Chip
                label={attempt.passed ? 'Đạt' : 'Không đạt'}
                color={percentageColor}
                size="small"
              />
              {attempt.needsManualGrading && (
                <Chip
                  label="Đang chờ chấm bài tự luận"
                  color="warning"
                  size="small"
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <GradeIcon color="primary" />
                  <Typography variant="h4" color="primary">
                    {attempt.percentage.toFixed(1)}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Điểm số: {attempt.score}/{attempt.totalPoints}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={attempt.percentage}
                  color={percentageColor}
                  sx={{ mt: 1, height: 8, borderRadius: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Thời gian làm bài
                </Typography>
                <Typography variant="h6">
                  {Math.floor(attempt.timeSpent / 60)} phút {attempt.timeSpent % 60} giây
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Nộp lúc
                </Typography>
                <Typography variant="body2">
                  {new Date(attempt.completedAt).toLocaleString('vi-VN')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {attempt.quiz.passingScore && (
            <Grid item xs={12}>
              <Alert severity={attempt.passed ? 'success' : 'error'}>
                Điểm đạt yêu cầu: {attempt.quiz.passingScore}%
                {attempt.passed
                  ? ' - Bạn đã vượt qua!'
                  : ' - Bạn chưa đạt yêu cầu'}
              </Alert>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Questions Review */}
      <Typography variant="h6" gutterBottom>
        Chi tiết câu hỏi
      </Typography>

      {!showCorrectAnswers && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Đáp án đúng sẽ được hiển thị {attempt.quiz.showAnswersAfter === 'after_due' ? 'sau khi hết hạn' : 'sau'}
        </Alert>
      )}

      {attempt.questionsSnapshot.map((question, index) =>
        renderQuestionReview(question, index)
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/courses/${attempt.course}`)}
        >
          Về khóa học
        </Button>

        {attempt.quiz.allowRetake && (
          <Button
            variant="contained"
            onClick={() => navigate(`/quizzes/${attempt.quiz._id}/take`)}
          >
            Làm lại
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default QuizResults;
