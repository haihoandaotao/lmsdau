import React, { Component } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            p: 3,
          }}
        >
          <ReportProblemIcon sx={{ fontSize: 60, color: 'error.main' }} />
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Đã có lỗi xảy ra
          </Typography>
          <Typography color="text.secondary">
            Rất tiếc, đã có sự cố không mong muốn. Vui lòng thử lại.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 3 }}
          >
            Tải lại trang
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
