/**
 * Coursera-style Progress Dashboard
 * Features: Visual progress, streaks, certificates, time tracking
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  EmojiEvents,
  LocalFireDepartment,
  AccessTime,
  CheckCircle,
  Star,
  Download
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const ProgressDashboard = ({ courseId }) => {
  const [stats, setStats] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, [courseId]);

  const fetchProgressData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await axios.get(`/api/progress/dashboard/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(res.data.data.stats);
      setWeeklyProgress(res.data.data.weeklyProgress);
      setAchievements(res.data.data.achievements);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/certificates/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading certificate:', err);
    }
  };

  if (loading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>;
  }

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

  const progressData = [
    { name: 'Completed', value: stats?.completedItems || 0 },
    { name: 'In Progress', value: stats?.inProgressItems || 0 },
    { name: 'Not Started', value: stats?.notStartedItems || 0 }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Overall Progress */}
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {stats?.completionPercentage || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Course Progress
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 50, opacity: 0.7 }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats?.completionPercentage || 0}
                sx={{ 
                  mt: 2, 
                  height: 8, 
                  borderRadius: 1,
                  bgcolor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Streak */}
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {stats?.currentStreak || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Day Streak 🔥
                  </Typography>
                </Box>
                <LocalFireDepartment sx={{ fontSize: 50, opacity: 0.7 }} />
              </Box>
              <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.8 }}>
                Longest: {stats?.longestStreak || 0} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Time Spent */}
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {Math.floor((stats?.totalTimeSpent || 0) / 60)}h
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Time Spent
                  </Typography>
                </Box>
                <AccessTime sx={{ fontSize: 50, opacity: 0.7 }} />
              </Box>
              <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.8 }}>
                Average: {Math.floor((stats?.avgTimePerDay || 0) / 60)}h per day
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {achievements?.length || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Achievements
                  </Typography>
                </Box>
                <EmojiEvents sx={{ fontSize: 50, opacity: 0.7 }} />
              </Box>
              <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.8 }}>
                {stats?.badgesEarned || 0} badges earned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Weekly Progress */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              📊 Weekly Learning Progress
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="videosWatched" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  name="Videos Watched"
                />
                <Line 
                  type="monotone" 
                  dataKey="timeSpent" 
                  stroke="#f093fb" 
                  strokeWidth={3}
                  name="Hours Spent"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Progress Breakdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              📈 Progress Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Achievements & Badges */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          🏆 Your Achievements
        </Typography>
        <Grid container spacing={2}>
          {achievements.map((achievement, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: 2,
                  background: achievement.unlocked 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'grey.100',
                  color: achievement.unlocked ? 'white' : 'text.secondary',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    margin: '0 auto',
                    bgcolor: achievement.unlocked ? 'rgba(255,255,255,0.2)' : 'grey.300',
                    fontSize: 30
                  }}
                >
                  {achievement.icon}
                </Avatar>
                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                  {achievement.title}
                </Typography>
                <Typography variant="caption">
                  {achievement.description}
                </Typography>
                {achievement.unlocked && (
                  <Chip 
                    label="Unlocked" 
                    size="small" 
                    sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Certificate Section */}
      {stats?.completionPercentage === 100 && (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <EmojiEvents sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            🎉 Congratulations!
          </Typography>
          <Typography variant="h6" paragraph>
            You've completed this course!
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<Download />}
            onClick={handleDownloadCertificate}
            sx={{ 
              bgcolor: 'white', 
              color: '#667eea',
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            Download Certificate
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default ProgressDashboard;
