/**
 * Enhanced Video Player - Coursera Style
 * Features: Transcripts, Bookmarks, Notes, Speed Control, Quality, PIP
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Slider,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  Settings,
  ClosedCaption,
  Bookmark,
  BookmarkBorder,
  Note,
  PictureInPicture,
  Speed,
  HighQuality
} from '@mui/icons-material';
import axios from 'axios';

const EnhancedVideoPlayer = ({ 
  videoUrl, 
  itemId, 
  courseId, 
  moduleId,
  startTime = 0,
  onProgress 
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [showCaptions, setShowCaptions] = useState(false);
  
  // Enhanced features state
  const [activeTab, setActiveTab] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [transcript, setTranscript] = useState([]);

  useEffect(() => {
    loadUserData();
  }, [itemId]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Load bookmarks
      const bookmarksRes = await axios.get(`/api/bookmarks/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(bookmarksRes.data.data || []);
      
      // Load notes
      const notesRes = await axios.get(`/api/notes/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(notesRes.data.data || []);
      
    } catch (err) {
      console.log('No saved data yet');
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    if (player) {
      player.volume(newValue / 100);
      setVolume(newValue);
    }
  };

  const handlePlaybackRateChange = (event) => {
    const rate = event.target.value;
    if (player) {
      player.playbackRate(rate);
      setPlaybackRate(rate);
    }
  };

  const handleSeek = (event, newValue) => {
    if (player) {
      player.currentTime(newValue);
      setCurrentTime(newValue);
    }
  };

  const handleAddBookmark = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/bookmarks', {
        itemId,
        timestamp: currentTime,
        title: `Bookmark at ${formatTime(currentTime)}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookmarks([...bookmarks, res.data.data]);
    } catch (err) {
      console.error('Error adding bookmark:', err);
    }
  };

  const handleAddNote = async () => {
    if (!currentNote.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/notes', {
        itemId,
        timestamp: currentTime,
        content: currentNote
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotes([...notes, res.data.data]);
      setCurrentNote('');
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const jumpToTimestamp = (timestamp) => {
    if (player) {
      player.currentTime(timestamp);
      setCurrentTime(timestamp);
    }
  };

  const handlePictureInPicture = () => {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        videoRef.current.requestPictureInPicture();
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Video Player */}
      <Paper 
        elevation={3} 
        sx={{ 
          position: 'relative', 
          paddingTop: '56.25%', // 16:9 aspect ratio
          bgcolor: '#000',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box
          ref={playerRef}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          <div data-vjs-player>
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered vjs-16-9"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </Box>

        {/* Custom Controls Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          {/* Progress Bar */}
          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSeek}
            sx={{
              color: '#f50057',
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                '&:hover': { boxShadow: '0 0 0 8px rgba(245, 0, 87, 0.16)' }
              }
            }}
          />

          {/* Control Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
            {/* Play/Pause */}
            <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            {/* Volume */}
            <IconButton 
              onClick={() => handleVolumeChange(null, volume === 0 ? 100 : 0)} 
              sx={{ color: 'white' }}
            >
              {volume === 0 ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            <Box sx={{ width: 100 }}>
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                sx={{ color: 'white' }}
              />
            </Box>

            {/* Time */}
            <Typography variant="body2" sx={{ minWidth: 100 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {/* Bookmark Button */}
            <Tooltip title="Add Bookmark">
              <IconButton onClick={handleAddBookmark} sx={{ color: '#ffd700' }}>
                <Bookmark />
              </IconButton>
            </Tooltip>

            {/* Speed Control */}
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={playbackRate}
                onChange={handlePlaybackRateChange}
                sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
              >
                <MenuItem value={0.5}>0.5x</MenuItem>
                <MenuItem value={0.75}>0.75x</MenuItem>
                <MenuItem value={1}>Normal</MenuItem>
                <MenuItem value={1.25}>1.25x</MenuItem>
                <MenuItem value={1.5}>1.5x</MenuItem>
                <MenuItem value={2}>2x</MenuItem>
              </Select>
            </FormControl>

            {/* Quality */}
            <Tooltip title="Quality">
              <IconButton sx={{ color: 'white' }}>
                <HighQuality />
              </IconButton>
            </Tooltip>

            {/* Captions */}
            <Tooltip title="Subtitles">
              <IconButton 
                onClick={() => setShowCaptions(!showCaptions)}
                sx={{ color: showCaptions ? '#f50057' : 'white' }}
              >
                <ClosedCaption />
              </IconButton>
            </Tooltip>

            {/* Picture-in-Picture */}
            <Tooltip title="Picture in Picture">
              <IconButton onClick={handlePictureInPicture} sx={{ color: 'white' }}>
                <PictureInPicture />
              </IconButton>
            </Tooltip>

            {/* Fullscreen */}
            <IconButton sx={{ color: 'white' }}>
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Enhanced Features Tabs */}
      <Paper sx={{ mt: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="📝 Transcript" />
          <Tab label="🔖 Bookmarks" />
          <Tab label="📓 My Notes" />
        </Tabs>

        <Box sx={{ p: 2, minHeight: 300, maxHeight: 400, overflowY: 'auto' }}>
          {/* Transcript Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Interactive transcript with clickable timestamps
              </Typography>
              <List dense>
                {transcript.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Transcript đang được cập nhật...
                  </Typography>
                ) : (
                  transcript.map((item, index) => (
                    <ListItem 
                      key={index}
                      button
                      onClick={() => jumpToTimestamp(item.time)}
                    >
                      <ListItemText
                        primary={item.text}
                        secondary={formatTime(item.time)}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          )}

          {/* Bookmarks Tab */}
          {activeTab === 1 && (
            <Box>
              {bookmarks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Bookmark sx={{ fontSize: 60, color: 'grey.400' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Chưa có bookmark nào. Click 🔖 để thêm!
                  </Typography>
                </Box>
              ) : (
                <List>
                  {bookmarks.map((bookmark, index) => (
                    <React.Fragment key={bookmark._id || index}>
                      <ListItem 
                        button
                        onClick={() => jumpToTimestamp(bookmark.timestamp)}
                      >
                        <ListItemIcon>
                          <Bookmark color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={bookmark.title}
                          secondary={formatTime(bookmark.timestamp)}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}

          {/* Notes Tab */}
          {activeTab === 2 && (
            <Box>
              {/* Add Note Form */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  ✍️ Add Note at {formatTime(currentTime)}
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ghi chú của bạn..."
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  sx={{ mb: 1, bgcolor: 'white' }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddNote}
                  disabled={!currentNote.trim()}
                >
                  Save Note
                </Button>
              </Box>

              {/* Notes List */}
              {notes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Note sx={{ fontSize: 60, color: 'grey.400' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Chưa có ghi chú nào
                  </Typography>
                </Box>
              ) : (
                <List>
                  {notes.map((note, index) => (
                    <React.Fragment key={note._id || index}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>
                          <Note color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Chip 
                                label={formatTime(note.timestamp)} 
                                size="small" 
                                color="primary"
                                clickable
                                onClick={() => jumpToTimestamp(note.timestamp)}
                              />
                            </Box>
                          }
                          secondary={note.content}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default EnhancedVideoPlayer;
