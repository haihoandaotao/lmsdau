import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Divider,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Forum as ForumIcon,
  TrendingUp as ProgressIcon,
  AccountCircle as ProfileIcon,
  MenuBook as MenuBookIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationsPopover from './NotificationsPopover';

const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotificationsMenu = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setNotificationsAnchorEl(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Chương trình đào tạo', icon: <MenuBookIcon />, path: '/curriculum', roles: ['student'] },
    { text: 'Khóa học', icon: <SchoolIcon />, path: '/courses' },
    { text: 'Bài tập', icon: <AssignmentIcon />, path: '/assignments' },
    { text: 'Diễn đàn', icon: <ForumIcon />, path: '/forum' },
    { text: 'Tiến độ', icon: <ProgressIcon />, path: '/progress' },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ px: 2, backgroundColor: theme.palette.primary.main }}>
        <Box display="flex" alignItems="center" gap={1.5} sx={{ width: '100%' }}>
          {/* Logo Trường */}
          <Box 
            component="img"
            src={`${process.env.PUBLIC_URL}/images/Logo-dau.png`}
            alt="Logo ĐH Kiến trúc Đà Nẵng"
            onError={(e) => {
              console.error('Logo load error:', e);
              e.target.style.display = 'none';
            }}
            sx={{ 
              width: 45, 
              height: 45, 
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3))',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.08)',
              }
            }}
          />
          <Typography 
            variant="h5" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '0.5px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            LMS-DAU
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 2 }}>
        {menuItems
          .filter(item => !item.roles || item.roles.includes(user?.role))
          .map((item) => (
          <ListItem 
            key={item.text} 
            onClick={() => navigate(item.path)} 
            button 
            sx={{ 
              py: 1.5, 
              px: 3,
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: theme.palette.primary.main,
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontSize: 15, 
                fontWeight: 600,
              }} 
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Can display current page title here */}
          </Typography>

          {/* Dark Mode Toggle - Moved here */}
          <Tooltip title="Chế độ ban ngày/đêm">
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Box 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ff6b6b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}
              >
                🌙
              </Box>
            </IconButton>
          </Tooltip>

          <Tooltip title="Thông báo">
            <IconButton color="inherit" onClick={handleOpenNotificationsMenu}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <NotificationsPopover
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleCloseNotificationsMenu}
          />

          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <Tooltip title="Cài đặt tài khoản">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.name} src={user?.avatar} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleCloseUserMenu(); }}>
                <ProfileIcon sx={{ mr: 1 }} />
                <Typography textAlign="center">Hồ sơ</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                <Typography textAlign="center">Đăng xuất</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
