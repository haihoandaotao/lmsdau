import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Divider,
  Skeleton,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  ThumbUp as ThumbUpIcon,
  Reply as ReplyIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

const ForumPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', description: '', action: null });

  useEffect(() => {
    fetchPostDetail();
    fetchComments();
  }, [id]);

  const fetchPostDetail = async () => {
    try {
      const { data } = await api.get(`/forum/posts/${id}`);
      setPost(data.data);
    } catch (error) {
      toast.error('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/forum/posts/${id}/comments`);
      setComments(data.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      const commentData = {
        content: newComment,
        parentComment: replyTo?._id || null
      };

      await api.post(`/forum/posts/${id}/comments`, commentData);
      toast.success('Bình luận thành công!');
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    } catch (error) {
      toast.error('Bình luận thất bại');
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await api.post(`/forum/comments/${commentId}/like`);
      fetchComments();
    } catch (error) {
      toast.error('Thích bình luận thất bại');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/forum/comments/${commentId}`);
      toast.success('Xóa bình luận thành công!');
      fetchComments();
    } catch (error) {
      toast.error('Xóa bình luận thất bại');
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/forum/posts/${id}`);
      toast.success('Xóa bài viết thành công!');
      navigate('/forum');
    } catch (error) {
      toast.error('Xóa bài viết thất bại');
    }
  };

  const openConfirmDialog = (title, description, action) => {
    setConfirmDialog({ open: true, title, description, action });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, title: '', description: '', action: null });
  };

  const confirmAction = () => {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    closeConfirmDialog();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Skeleton variant="text" height={60} />
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="rectangular" height={300} />
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">Không tìm thấy bài viết</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/forum')}
          sx={{ mb: 2 }}
        >
          Quay lại diễn đàn
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              {post.title}
            </Typography>

            {user._id === post.author._id && (
              <>
                <IconButton
                  onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                  aria-label="more options"
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={() => setMenuAnchorEl(null)}
                >
                  <MenuItem onClick={() => openConfirmDialog(
                    'Xóa bài viết',
                    'Bạn có chắc chắn muốn xóa bài viết này?',
                    handleDeletePost
                  )}>
                    Xóa bài viết
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
              {post.author?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">
                {post.author?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>

          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {post.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Bình luận ({comments.length})
          </Typography>

          {comments.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              {comments.map((comment) => (
                <Box key={comment._id} sx={{ mb: 2, pl: comment.parentComment ? 4 : 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 2, mt: 0.5 }}>
                      {comment.author?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ mr: 1 }}>
                          {comment.author?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        {comment.content}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<ThumbUpIcon />}
                          onClick={() => handleLikeComment(comment._id)}
                        >
                          Thích ({comment.likes?.length || 0})
                        </Button>
                        <Button
                          size="small"
                          startIcon={<ReplyIcon />}
                          onClick={() => setReplyTo(comment)}
                        >
                          Trả lời
                        </Button>
                        {user._id === comment.author._id && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => openConfirmDialog(
                              'Xóa bình luận',
                              'Bạn có chắc chắn muốn xóa bình luận này?',
                              () => handleDeleteComment(comment._id)
                            )}
                          >
                            Xóa
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Chưa có bình luận nào.
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {replyTo && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Đang trả lời: {replyTo.author?.name}
              </Typography>
              <Button size="small" onClick={() => setReplyTo(null)}>
                Hủy trả lời
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar sx={{ width: 40, height: 40 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Viết bình luận của bạn..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {replyTo && (
                  <Button onClick={() => setReplyTo(null)}>
                    Hủy
                  </Button>
                )}
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Bình luận
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        onConfirm={confirmAction}
        title={confirmDialog.title}
        description={confirmDialog.description}
      />
    </Container>
  );
};

export default ForumPost;
