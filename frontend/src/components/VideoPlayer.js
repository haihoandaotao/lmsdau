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
    if (!videoRef.current || !videoUrl) {
      console.log('Missing videoRef or videoUrl');
      return;
    }

    // Wait for element to be in DOM
    const initPlayer = () => {
      // Check if it's a YouTube URL
      const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
      
      console.log('Initializing player for:', videoUrl, 'YouTube:', isYouTube);

      const options = {
        autoplay: autoplay,
        controls: true, // Enable default controls first
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        sources: [{
          src: videoUrl,
          type: isYouTube ? 'video/youtube' : 'video/mp4'
        }],
        techOrder: isYouTube ? ['youtube'] : ['html5'],
        youtube: isYouTube ? { 
          ytControls: 2, // Use YouTube controls
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        } : undefined
      };

      try {
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
      } catch (error) {
        console.error('Error initializing player:', error);
      }
    };

    // Delay initialization to ensure DOM is ready
    const timeoutId = setTimeout(initPlayer, 100);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerRef.current) {
        // Save progress before unmounting
        try {
          updateProgress(playerRef.current.currentTime(), playerRef.current.duration());
          playerRef.current.dispose();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
    };
  }, [videoUrl]);

  // Update progress to backend
  const updateProgress = async (currentTime, totalDuration) => {
    if (!itemId || !courseId || !moduleId) return;
    if (!currentTime || !totalDuration || isNaN(currentTime) || isNaN(totalDuration)) return;
    
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
      // Silently fail - don't disrupt video playback
      console.log('Progress update skipped:', error.response?.status || error.message);
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

  // Guard: return early if no videoUrl
  if (!videoUrl) {
    return (
      <Box sx={{ width: '100%', bgcolor: 'black', p: 4, textAlign: 'center', borderRadius: 1 }}>
        <Typography color="white">Không có video để phát</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
      {/* Video Element */}
      <div data-vjs-player style={{ width: '100%' }}>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered vjs-16-9"
          playsInline
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </Box>
  );
};

export default VideoPlayer;
