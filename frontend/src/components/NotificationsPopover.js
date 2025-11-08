import React from 'react';
import {
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Button,
  Chip
} from '@mui/material';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const NotificationsPopover = ({ anchorEl, open, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleMarkAll = () => {
    markAllAsRead();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 360,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Thông báo</Typography>
        {unreadCount > 0 && <Chip label={`${unreadCount} mới`} color="primary" size="small" />}
      </Box>
      <Divider />
      
      {notifications.length > 0 ? (
        <List sx={{ overflow: 'auto', flexGrow: 1 }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification._id}
              button
              onClick={() => !notification.read && markAsRead(notification._id)}
              sx={{
                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                alignItems: 'flex-start'
              }}
            >
              <ListItemText
                primary={notification.message}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography sx={{ p: 2, textAlign: 'center' }}>Bạn không có thông báo nào.</Typography>
      )}

      <Divider />
      <Box sx={{ p: 1, textAlign: 'center' }}>
        <Button onClick={handleMarkAll} disabled={unreadCount === 0} size="small">
          Đánh dấu tất cả là đã đọc
        </Button>
      </Box>
    </Popover>
  );
};

export default NotificationsPopover;
