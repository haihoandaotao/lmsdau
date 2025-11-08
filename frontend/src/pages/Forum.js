import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  TextField,
  Fab,
  Skeleton,
  Alert,
  Avatar,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Forum as ForumIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';

const Forum = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/forum/posts');
      setPosts(data.data);
    } catch (error) {
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Diễn đàn"
        subtitle="Thảo luận và chia sẻ kiến thức"
      />

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Tìm kiếm bài viết"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="rectangular" height={36} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Grid item key={post._id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2
                    }}
                  >
                    {post.content}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      {post.author?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {post.author?.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={formatDate(post.createdAt)}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<MessageIcon />}
                      label={`${post.comments?.length || 0} bình luận`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {post.tags && post.tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {post.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" />
                      ))}
                    </Box>
                  )}
                </CardContent>

                <Divider />

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate(`/forum/${post._id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">
              {searchTerm ? 'Không tìm thấy bài viết nào phù hợp.' : 'Chưa có bài viết nào trong diễn đàn.'}
            </Alert>
          </Grid>
        )}
      </Grid>

      <Fab
        color="primary"
        aria-label="add post"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/forum/create')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Forum;
