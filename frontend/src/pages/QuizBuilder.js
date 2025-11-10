import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, TextField, Button, IconButton, Snackbar, Alert,
  Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip, 
  Switch, FormControlLabel, Divider, Radio, RadioGroup, Checkbox, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon, ArrowUpward as UpIcon, ArrowDownward as DownIcon,
  Save as SaveIcon, Preview as PreviewIcon, ArrowBack as BackIcon
} from '@mui/icons-material';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const questionTypes = [
  { value: 'multiple_choice', label: 'Trắc nghiệm (MCQ)' },
  { value: 'true_false', label: 'Đúng/Sai' },
  { value: 'short_answer', label: 'Trả lời ngắn' },
  { value: 'essay', label: 'Tự luận' }
];

const showAnswersOptions = [
  { value: 'immediate', label: 'Ngay sau khi nộp' },
  { value: 'after_due', label: 'Sau khi hết hạn' },
  { value: 'never', label: 'Không hiển thị' }
];

function QuizBuilder() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const courseId = new URLSearchParams(location.search).get('courseId');

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Quiz data
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    status: 'draft',
    timeLimit: null,
    maxAttempts: 1,
    allowRetake: false,
    passingScore: 60,
    shuffleQuestions: false,
    shuffleOptions: false,
    showCorrectAnswers: true,
    showAnswersAfter: 'immediate',
    autoGrade: true,
    questions: []
  });

  // Load existing quiz if editing
  useEffect(() => {
    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/quizzes/${quizId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuizData(response.data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Không thể tải quiz',
        severity: 'error'
      });
    }
  };

  const handleQuizChange = (field, value) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  // Question management
  const addQuestion = (type = 'multiple_choice') => {
    const newQuestion = {
      _id: Date.now().toString(), // Temporary ID
      type,
      question: '',
      points: 1,
      order: quizData.questions.length,
      options: type === 'multiple_choice' ? [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ] : undefined,
      correctAnswer: type === 'true_false' ? true : undefined,
      acceptedAnswers: ['short_answer', 'fill_blank'].includes(type) ? [''] : undefined,
      caseSensitive: false,
      explanation: ''
    };

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...quizData.questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuizData(prev => ({ ...prev, questions: updated }));
  };

  const deleteQuestion = (index) => {
    const updated = quizData.questions.filter((_, i) => i !== index);
    setQuizData(prev => ({ ...prev, questions: updated }));
  };

  const moveQuestion = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === quizData.questions.length - 1)
    ) {
      return;
    }

    const updated = [...quizData.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];

    setQuizData(prev => ({ ...prev, questions: updated }));
  };

  // Options management for MCQ
  const addOption = (questionIndex) => {
    const updated = [...quizData.questions];
    updated[questionIndex].options.push({ text: '', isCorrect: false });
    setQuizData(prev => ({ ...prev, questions: updated }));
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updated = [...quizData.questions];
    updated[questionIndex].options[optionIndex][field] = value;

    // If setting an option as correct, uncheck others
    if (field === 'isCorrect' && value === true) {
      updated[questionIndex].options.forEach((opt, i) => {
        if (i !== optionIndex) opt.isCorrect = false;
      });
    }

    setQuizData(prev => ({ ...prev, questions: updated }));
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updated = [...quizData.questions];
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuizData(prev => ({ ...prev, questions: updated }));
  };

  // Accepted answers for short answer
  const addAcceptedAnswer = (questionIndex) => {
    const updated = [...quizData.questions];
    updated[questionIndex].acceptedAnswers.push('');
    setQuizData(prev => ({ ...prev, questions: updated }));
  };

  const updateAcceptedAnswer = (questionIndex, answerIndex, value) => {
    const updated = [...quizData.questions];
    updated[questionIndex].acceptedAnswers[answerIndex] = value;
    setQuizData(prev => ({ ...prev, questions: updated }));
  };

  const deleteAcceptedAnswer = (questionIndex, answerIndex) => {
    const updated = [...quizData.questions];
    updated[questionIndex].acceptedAnswers = updated[questionIndex].acceptedAnswers.filter(
      (_, i) => i !== answerIndex
    );
    setQuizData(prev => ({ ...prev, questions: updated }));
  };

  // Save quiz
  const handleSave = async (publish = false) => {
    try {
      // Validation
      if (!quizData.title.trim()) {
        setSnackbar({ open: true, message: 'Vui lòng nhập tiêu đề quiz', severity: 'error' });
        return;
      }

      if (quizData.questions.length === 0) {
        setSnackbar({ open: true, message: 'Vui lòng thêm ít nhất 1 câu hỏi', severity: 'error' });
        return;
      }

      // Validate questions
      for (let i = 0; i < quizData.questions.length; i++) {
        const q = quizData.questions[i];
        if (!q.question.trim()) {
          setSnackbar({
            open: true,
            message: `Câu hỏi ${i + 1}: Vui lòng nhập nội dung`,
            severity: 'error'
          });
          return;
        }

        if (q.type === 'multiple_choice') {
          if (!q.options || q.options.length < 2) {
            setSnackbar({
              open: true,
              message: `Câu hỏi ${i + 1}: Cần ít nhất 2 đáp án`,
              severity: 'error'
            });
            return;
          }

          const hasCorrect = q.options.some(opt => opt.isCorrect);
          if (!hasCorrect) {
            setSnackbar({
              open: true,
              message: `Câu hỏi ${i + 1}: Vui lòng đánh dấu đáp án đúng`,
              severity: 'error'
            });
            return;
          }
        }

        if (['short_answer', 'fill_blank'].includes(q.type)) {
          if (!q.acceptedAnswers || q.acceptedAnswers.length === 0 || !q.acceptedAnswers[0].trim()) {
            setSnackbar({
              open: true,
              message: `Câu hỏi ${i + 1}: Vui lòng nhập ít nhất 1 đáp án đúng`,
              severity: 'error'
            });
            return;
          }
        }
      }

      setLoading(true);

      const payload = {
        ...quizData,
        courseId: courseId,
        status: publish ? 'published' : quizData.status
      };

      const token = localStorage.getItem('token');

      if (quizId) {
        // Update existing
        await axios.put(
          `http://localhost:5000/api/quizzes/${quizId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new
        await axios.post(
          'http://localhost:5000/api/quizzes',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSnackbar({
        open: true,
        message: publish ? 'Đã xuất bản quiz!' : 'Lưu quiz thành công!',
        severity: 'success'
      });

      setTimeout(() => {
        navigate(`/courses/${courseId}`);
      }, 1500);
    } catch (error) {
      console.error('Save quiz error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Lỗi khi lưu quiz',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionEditor = (question, index) => {
    return (
      <Card key={question._id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Câu hỏi {index + 1}</Typography>
            <Box>
              <Tooltip title="Di chuyển lên">
                <IconButton onClick={() => moveQuestion(index, 'up')} disabled={index === 0}>
                  <UpIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Di chuyển xuống">
                <IconButton
                  onClick={() => moveQuestion(index, 'down')}
                  disabled={index === quizData.questions.length - 1}
                >
                  <DownIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa câu hỏi">
                <IconButton onClick={() => deleteQuestion(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <FormControl fullWidth>
                <InputLabel>Loại câu hỏi</InputLabel>
                <Select
                  value={question.type}
                  label="Loại câu hỏi"
                  onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                >
                  {questionTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Điểm"
                value={question.points}
                onChange={(e) => updateQuestion(index, 'points', parseFloat(e.target.value))}
                inputProps={{ min: 0.5, step: 0.5 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Nội dung câu hỏi"
                value={question.question}
                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                required
              />
            </Grid>

            {/* Multiple Choice Options */}
            {question.type === 'multiple_choice' && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Các đáp án:</Typography>
                {question.options?.map((option, optIdx) => (
                  <Box key={optIdx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={(e) => updateOption(index, optIdx, 'isCorrect', e.target.checked)}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Đáp án ${optIdx + 1}`}
                      value={option.text}
                      onChange={(e) => updateOption(index, optIdx, 'text', e.target.value)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => deleteOption(index, optIdx)}
                      disabled={question.options.length <= 2}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addOption(index)}
                  size="small"
                >
                  Thêm đáp án
                </Button>
              </Grid>
            )}

            {/* True/False */}
            {question.type === 'true_false' && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Đáp án đúng:</Typography>
                <RadioGroup
                  value={question.correctAnswer ? 'true' : 'false'}
                  onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value === 'true')}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Đúng" />
                  <FormControlLabel value="false" control={<Radio />} label="Sai" />
                </RadioGroup>
              </Grid>
            )}

            {/* Short Answer / Fill Blank */}
            {['short_answer', 'fill_blank'].includes(question.type) && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Các câu trả lời được chấp nhận:
                </Typography>
                {question.acceptedAnswers?.map((answer, ansIdx) => (
                  <Box key={ansIdx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Đáp án ${ansIdx + 1}`}
                      value={answer}
                      onChange={(e) => updateAcceptedAnswer(index, ansIdx, e.target.value)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => deleteAcceptedAnswer(index, ansIdx)}
                      disabled={question.acceptedAnswers.length <= 1}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => addAcceptedAnswer(index)}
                  size="small"
                >
                  Thêm đáp án
                </Button>

                <FormControlLabel
                  control={
                    <Switch
                      checked={question.caseSensitive}
                      onChange={(e) => updateQuestion(index, 'caseSensitive', e.target.checked)}
                    />
                  }
                  label="Phân biệt chữ hoa/thường"
                  sx={{ mt: 1 }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Giải thích (hiển thị sau khi nộp bài)"
                value={question.explanation || ''}
                onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                placeholder="Giải thích tại sao đáp án này đúng..."
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate(`/courses/${courseId}`)}>
              <BackIcon />
            </IconButton>
            <Typography variant="h4">
              {quizId ? 'Chỉnh sửa Quiz' : 'Tạo Quiz mới'}
            </Typography>
          </Box>
          <Chip
            label={quizData.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
            color={quizData.status === 'published' ? 'success' : 'default'}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Quiz Settings */}
        <Typography variant="h6" gutterBottom>Thông tin Quiz</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Tiêu đề Quiz"
              value={quizData.title}
              onChange={(e) => handleQuizChange('title', e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Thời gian (phút)"
              value={quizData.timeLimit || ''}
              onChange={(e) => handleQuizChange('timeLimit', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Không giới hạn"
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Mô tả"
              value={quizData.description}
              onChange={(e) => handleQuizChange('description', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Số lần làm tối đa"
              value={quizData.maxAttempts}
              onChange={(e) => handleQuizChange('maxAttempts', parseInt(e.target.value))}
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Điểm đạt (%)"
              value={quizData.passingScore}
              onChange={(e) => handleQuizChange('passingScore', parseFloat(e.target.value))}
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Hiển thị đáp án</InputLabel>
              <Select
                value={quizData.showAnswersAfter}
                label="Hiển thị đáp án"
                onChange={(e) => handleQuizChange('showAnswersAfter', e.target.value)}
              >
                {showAnswersOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={quizData.allowRetake}
                  onChange={(e) => handleQuizChange('allowRetake', e.target.checked)}
                />
              }
              label="Cho phép làm lại"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={quizData.shuffleQuestions}
                  onChange={(e) => handleQuizChange('shuffleQuestions', e.target.checked)}
                />
              }
              label="Xáo trộn câu hỏi"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Questions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Câu hỏi ({quizData.questions.length})
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Thêm câu hỏi</InputLabel>
            <Select
              label="Thêm câu hỏi"
              value=""
              onChange={(e) => addQuestion(e.target.value)}
            >
              {questionTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {quizData.questions.map((question, index) => renderQuestionEditor(question, index))}

        {quizData.questions.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Typography color="text.secondary">
              Chưa có câu hỏi nào. Chọn loại câu hỏi ở trên để thêm.
            </Typography>
          </Paper>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            Hủy
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={() => handleSave(false)}
            disabled={loading}
          >
            Lưu nháp
          </Button>
          <Button
            variant="contained"
            startIcon={<PreviewIcon />}
            onClick={() => handleSave(true)}
            disabled={loading}
          >
            Xuất bản
          </Button>
        </Box>
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

export default QuizBuilder;
