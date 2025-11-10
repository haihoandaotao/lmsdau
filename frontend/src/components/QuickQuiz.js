/**
 * Quick Quiz Component - Kiểm tra nhanh sau mỗi bài học
 * Phải đạt 80% mới được tiếp tục
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Quiz as QuizIcon
} from '@mui/icons-material';

const QuickQuiz = ({ questions, onPass, itemId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const handleSubmit = () => {
    // Calculate score
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    
    const percentage = (correct / questions.length) * 100;
    setScore(percentage);
    setShowResults(true);

    // If passed (>= 80%), unlock next item
    if (percentage >= 80) {
      onPass && onPass();
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const passed = score >= 80;
    
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        {passed ? (
          <Box>
            <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ color: '#4caf50', fontWeight: 700 }}>
              🎉 Xuất Sắc!
            </Typography>
            <Typography variant="h6" paragraph>
              Bạn đã đạt {score.toFixed(0)}%
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Bạn đã hoàn thành bài kiểm tra. Bài học tiếp theo đã được mở khóa!
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Tiếp Tục Học
            </Button>
          </Box>
        ) : (
          <Box>
            <Cancel sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ color: '#f44336', fontWeight: 700 }}>
              Chưa Đạt
            </Typography>
            <Typography variant="h6" paragraph>
              Bạn đạt {score.toFixed(0)}% (Cần 80% để qua)
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Hãy xem lại bài học và thử lại nhé!
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              onClick={handleRetry}
              sx={{ mt: 2 }}
            >
              Làm Lại
            </Button>
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            📊 Chi Tiết Câu Trả Lời
          </Typography>
          {questions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <Paper 
                key={index} 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  border: 2,
                  borderColor: isCorrect ? '#4caf50' : '#f44336',
                  bgcolor: isCorrect ? '#e8f5e9' : '#ffebee'
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Câu {index + 1}: {q.question}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                  <Chip 
                    label={`Bạn chọn: ${userAnswer || 'Không trả lời'}`}
                    color={isCorrect ? 'success' : 'error'}
                    size="small"
                  />
                  {!isCorrect && (
                    <Chip 
                      label={`Đáp án đúng: ${q.correctAnswer}`}
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
                {q.explanation && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <strong>Giải thích:</strong> {q.explanation}
                  </Alert>
                )}
              </Paper>
            );
          })}
        </Box>
      </Paper>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <QuizIcon color="primary" />
            Kiểm Tra Nhanh
          </Typography>
          <Chip 
            label={`${currentQuestion + 1}/${questions.length}`}
            color="primary"
          />
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Lưu ý:</strong> Bạn cần đạt tối thiểu 80% để mở khóa bài học tiếp theo.
      </Alert>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Câu {currentQuestion + 1}: {currentQ.question}
        </Typography>
        
        <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
          <RadioGroup
            value={answers[currentQuestion] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
          >
            {currentQ.options.map((option, index) => (
              <Paper 
                key={index}
                sx={{ 
                  p: 2, 
                  mb: 1,
                  border: 2,
                  borderColor: answers[currentQuestion] === option ? 'primary.main' : 'grey.300',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.light', bgcolor: 'grey.50' }
                }}
                onClick={() => handleAnswerChange(currentQuestion, option)}
              >
                <FormControlLabel
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{ width: '100%', m: 0 }}
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          variant="outlined"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
        >
          ← Câu Trước
        </Button>
        
        {currentQuestion < questions.length - 1 ? (
          <Button
            variant="contained"
            disabled={!answers[currentQuestion]}
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
          >
            Câu Tiếp →
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            disabled={Object.keys(answers).length < questions.length}
            onClick={handleSubmit}
          >
            Nộp Bài
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Đã trả lời: {Object.keys(answers).length}/{questions.length} câu
        </Typography>
      </Box>
    </Paper>
  );
};

export default QuickQuiz;
