import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, IconButton, Slider, Select, MenuItem, FormControl, Tooltip } from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Settings,
  ClosedCaption
} from '@mui/icons-material';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-youtube';
import axios from 'axios';

const VideoPlayer = ({ 
  videoUrl, 
  itemId,
  courseId, 
  moduleId,
  onProgress,
  startTime = 0,
  autoplay = false 
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('auto');

  useEffect(() => {
    if (!videoRef.current) return;

    // Check if it's a YouTube URL
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

    const options = {
      autoplay: autoplay,
      controls: false,
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      sources: [{
        src: videoUrl,
        type: isYouTube ? 'video/youtube' : 'video/mp4'
      }],
      techOrder: isYouTube ? ['youtube'] : ['html5'],
      youtube: isYouTube ? { 
        ytControls: 0,
        modestbranding: 1,
        rel: 0
      } : undefined
    };

    // Initialize Video.js
    const player = videojs(videoRef.current, options, function onPlayerReady() {
      console.log('Video player is ready');
      
      // Set start time
      if (startTime > 0) {
        this.currentTime(startTime);
      }
      
      setDuration(this.duration());
    });

    playerRef.current = player;

    // Event listeners
    player.on('play', () => setIsPlaying(true));
    player.on('pause', () => setIsPlaying(false));
    
    player.on('timeupdate', () => {
      setCurrentTime(player.currentTime());
    });
    
    player.on('durationchange', () => {
      setDuration(player.duration());
    });
    
    player.on('volumechange', () => {
      setVolume(player.volume());
      setIsMuted(player.muted());
    });

    // Track progress every 5 seconds
    progressIntervalRef.current = setInterval(() => {
      if (player && !player.paused()) {
        updateProgress(player.currentTime(), player.duration());
      }
    }, 5000);

    // Cleanup
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerRef.current) {
        // Save progress before unmounting
        updateProgress(playerRef.current.currentTime(), playerRef.current.duration());
        playerRef.current.dispose();
      }
    };
  }, [videoUrl]);

  // Update progress to backend
  const updateProgress = async (currentTime, totalDuration) => {
    if (!itemId || !courseId || !moduleId) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/video-progress',
        {
          courseId,
          moduleId,
          itemId,
          currentTime: Math.floor(currentTime),
          totalDuration: Math.floor(totalDuration)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (onProgress) {
        onProgress({
          currentTime,
          totalDuration,
          percentage: (currentTime / totalDuration) * 100
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // Control handlers
  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  const handleVolumeChange = (event, newValue) => {
    if (playerRef.current) {
      playerRef.current.volume(newValue);
      setVolume(newValue);
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      playerRef.current.muted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (event, newValue) => {
    if (playerRef.current) {
      playerRef.current.currentTime(newValue);
      setCurrentTime(newValue);
    }
  };

  const handlePlaybackRateChange = (event) => {
    const rate = event.target.value;
    if (playerRef.current) {
      playerRef.current.playbackRate(rate);
      setPlaybackRate(rate);
    }
  };

  const handleFullscreen = () => {
    if (playerRef.current) {
      if (!isFullscreen) {
        playerRef.current.requestFullscreen();
      } else {
        playerRef.current.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'black', position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
      {/* Video Element */}
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          playsInline
        />
      </div>

      {/* Custom Controls Overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
      >
        {/* Progress Bar */}
        <Slider
          value={currentTime}
          max={duration || 100}
          onChange={handleSeek}
          sx={{
            color: '#C8102E',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              '&:hover': {
                boxShadow: '0 0 0 8px rgba(200, 16, 46, 0.16)'
              }
            }
          }}
        />

        {/* Controls Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Play/Pause */}
          <Tooltip title={isPlaying ? 'Tạm dừng' : 'Phát'}>
            <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>

          {/* Volume */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
            <Tooltip title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}>
              <IconButton onClick={handleMuteToggle} sx={{ color: 'white' }}>
                {isMuted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            </Tooltip>
            <Slider
              value={isMuted ? 0 : volume}
              max={1}
              step={0.1}
              onChange={handleVolumeChange}
              sx={{
                color: 'white',
                width: 80,
                ml: 1
              }}
            />
          </Box>

          {/* Time Display */}
          <Typography variant="body2" sx={{ color: 'white', minWidth: 100 }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Playback Rate */}
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={playbackRate}
              onChange={handlePlaybackRateChange}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                '.MuiSvgIcon-root': { color: 'white' }
              }}
            >
              <MenuItem value={0.5}>0.5x</MenuItem>
              <MenuItem value={0.75}>0.75x</MenuItem>
              <MenuItem value={1}>Bình thường</MenuItem>
              <MenuItem value={1.25}>1.25x</MenuItem>
              <MenuItem value={1.5}>1.5x</MenuItem>
              <MenuItem value={2}>2x</MenuItem>
            </Select>
          </FormControl>

          {/* Settings */}
          <Tooltip title="Cài đặt">
            <IconButton sx={{ color: 'white' }} onClick={() => setShowSettings(!showSettings)}>
              <Settings />
            </IconButton>
          </Tooltip>

          {/* Fullscreen */}
          <Tooltip title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}>
            <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
