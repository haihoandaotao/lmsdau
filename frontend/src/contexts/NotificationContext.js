import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

let socket;

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
      const unread = data.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Connect to socket
      socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        query: { userId: user._id },
      });

      socket.on('connect', () => {
        console.log('Socket.IO connected');
      });

      socket.on('notification', (newNotification) => {
        toast.info(`Bạn có thông báo mới: ${newNotification.message}`);
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
      });

      return () => {
        socket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
      }
    }
  }, [user, fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
        await api.patch('/notifications/read-all');
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    } catch (error) {
        console.error('Failed to mark all notifications as read', error);
        toast.error('Đã có lỗi xảy ra.');
    }
  };


  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
