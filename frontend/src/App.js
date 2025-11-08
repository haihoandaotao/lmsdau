import React, { Suspense, lazy, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Assignments = lazy(() => import('./pages/Assignments'));
const AssignmentDetail = lazy(() => import('./pages/AssignmentDetail'));
const Forum = lazy(() => import('./pages/Forum'));
const ForumPost = lazy(() => import('./pages/ForumPost'));
const Progress = lazy(() => import('./pages/Progress'));
const Profile = lazy(() => import('./pages/Profile'));

const ThemeWrapper = ({ children }) => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDark ? 'dark' : 'light');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#C8102E', // Đỏ đậm DAU
        light: '#E63946',
        dark: '#A00C24',
        contrastText: '#fff',
      },
      secondary: {
        main: '#2C3E50', // Xám xanh đậm
        light: '#546E7A',
        dark: '#1A252F',
        contrastText: '#fff',
      },
      background: {
        default: mode === 'light' ? '#F8F9FA' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: mode === 'light' ? '#2C3E50' : '#E0E0E0',
        secondary: mode === 'light' ? '#546E7A' : '#B0B0B0',
      },
      error: {
        main: '#D32F2F',
      },
      warning: {
        main: '#F57C00',
      },
      info: {
        main: '#0288D1',
      },
      success: {
        main: '#388E3C',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Segoe UI", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(200, 16, 46, 0.05)',
      '0px 4px 8px rgba(200, 16, 46, 0.08)',
      '0px 6px 12px rgba(200, 16, 46, 0.10)',
      '0px 8px 16px rgba(200, 16, 46, 0.12)',
      '0px 10px 20px rgba(200, 16, 46, 0.14)',
      ...Array(19).fill('0px 0px 0px rgba(0,0,0,0)'),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '10px 24px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0px 6px 16px rgba(200, 16, 46, 0.2)',
            },
          },
          contained: {
            boxShadow: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            border: mode === 'light' ? '1px solid #E0E0E0' : '1px solid #2C2C2C',
            '&:hover': {
              boxShadow: '0px 8px 24px rgba(200, 16, 46, 0.12)',
              transform: 'translateY(-4px)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(200, 16, 46, 0.1)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: mode === 'light' ? '1px solid #E0E0E0' : '1px solid #2C2C2C',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1300 }}>
        <IconButton 
          color="inherit" 
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} 
          aria-label="toggle dark mode"
          sx={{
            backgroundColor: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)',
            },
          }}
        >
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </div>
      {children}
    </ThemeProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeWrapper>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Suspense fallback={<div style={{ padding: 24 }}>Đang tải...</div>}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="courses/:id" element={<CourseDetail />} />
                    <Route path="assignments" element={<Assignments />} />
                    <Route path="assignments/:id" element={<AssignmentDetail />} />
                    <Route path="forum" element={<Forum />} />
                    <Route path="forum/:id" element={<ForumPost />} />
                    <Route path="progress" element={<Progress />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
            <ToastContainer position="top-right" autoClose={3000} />
          </NotificationProvider>
        </AuthProvider>
      </ThemeWrapper>
    </ErrorBoundary>
  );
}

export default App;
