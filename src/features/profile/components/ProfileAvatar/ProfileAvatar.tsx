import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Badge,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { uploadAvatar } from '@/features/profile/api/userApi';
import type { AuthUser } from '@/features/auth/api/authApi';
import {
  validateAvatarFile,
  startCameraStream,
  stopCameraStream,
  captureCanvasPhoto,
} from '@/features/profile/utils/avatarUtils';

interface ProfileAvatarProps {
  user: AuthUser | null | undefined;
  onUploadSuccess: (updatedUser: AuthUser) => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user, onUploadSuccess }) => {
  // Dialog & Photo States
  const [openDialog, setOpenDialog] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Connect video element to stream when stream becomes active
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        stopCameraStream(cameraStream);
      }
    };
  }, [cameraStream]);

  const rawFirstName = user?.firstName;
  const rawLastName = user?.lastName;
  const initials =
    rawFirstName && rawLastName
      ? `${rawFirstName[0] || ''}${rawLastName[0] || ''}`.toUpperCase()
      : '';

  const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000/api';
  const IMAGE_BASE = API_BASE.replace('/api', '');
  const avatarUrl = user?.profilePictureUrl ? `${IMAGE_BASE}${user.profilePictureUrl}` : '';

  // Dialog Controls
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setCameraActive(false);
    setCapturedFile(null);
    setPreviewUrl('');
  };

  const handleCloseDialog = () => {
    stopCamera();
    setOpenDialog(false);
  };

  // Webcam Controls
  const startCamera = async () => {
    try {
      const stream = await startCameraStream();
      setCameraStream(stream);
      setCameraActive(true);
      setCapturedFile(null);
      setPreviewUrl('');
    } catch (err) {
      toast.error('Could not access camera. Please check system permissions.');
    }
  };

  const stopCamera = () => {
    stopCameraStream(cameraStream);
    setCameraStream(null);
    setCameraActive(false);
  };

  const capturePhoto = async () => {
    const file = await captureCanvasPhoto(videoRef.current, canvasRef.current);
    if (file) {
      setCapturedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      stopCamera();
    }
  };

  const uploadCapturedPhoto = async () => {
    if (!capturedFile) return;

    setIsUploading(true);
    try {
      const res = await uploadAvatar(capturedFile);
      onUploadSuccess(res.user);
      toast.success('Profile picture updated successfully!');
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger library upload
  const handleUploadFromLibrary = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const errorMsg = validateAvatarFile(file);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadAvatar(file);
      onUploadSuccess(res.user);
      toast.success('Profile picture updated successfully!');
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Hidden library picker */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleAvatarFileChange}
      />

      {/* Badge with camera overlay on Avatar */}
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Box
            sx={{
              backgroundColor: '#f27a23',
              borderRadius: '50%',
              padding: '5px',
              display: 'flex',
              border: '3px solid',
              borderColor: 'primary.dark',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <StarIcon sx={{ fontSize: '1rem', color: 'white' }} />
          </Box>
        }
      >
        <Box
          onClick={handleOpenDialog}
          sx={{
            position: 'relative',
            borderRadius: '50%',
            cursor: 'pointer',
            overflow: 'hidden',
            '&:hover .avatar-overlay': {
              opacity: 1,
            },
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          }}
        >
          <Avatar
            src={avatarUrl}
            sx={{
              width: 96,
              height: 96,
              fontSize: '2.5rem',
              backgroundColor: '#E5E7EB',
              color: '#4B5563',
              fontWeight: 'bold',
              border: '4px solid white',
              transition: 'all 0.3s ease',
            }}
          >
            {initials}
          </Avatar>

          {/* Upload Overlay */}
          <Box
            className="avatar-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              opacity: 0,
              transition: 'opacity 0.25s ease',
              borderRadius: '50%',
            }}
          >
            {isUploading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <>
                <PhotoCameraIcon sx={{ fontSize: '1.5rem', mb: 0.25 }} />
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 'bold' }}>
                  CHANGE
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Badge>

      {/* Upload/Camera Selection Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '1.5rem',
            padding: '0.5rem',
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          Change Avatar
          <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          {!cameraActive && !previewUrl && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<CloudUploadIcon />}
                onClick={handleUploadFromLibrary}
                sx={{
                  borderRadius: '1rem',
                  py: 2,
                  borderWidth: '2px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { borderWidth: '2px' },
                }}
              >
                Upload from Files
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<CameraAltIcon />}
                onClick={startCamera}
                sx={{
                  borderRadius: '1rem',
                  py: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(15, 90, 97, 0.2)',
                }}
              >
                Take a Photo
              </Button>
            </Box>
          )}

          {/* Webcam stream */}
          {cameraActive && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 2,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '4px solid',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Button
                variant="contained"
                color="secondary"
                onClick={capturePhoto}
                startIcon={<CameraAltIcon />}
                sx={{
                  borderRadius: '2rem',
                  px: 4,
                  py: 1,
                  fontWeight: 'bold',
                  backgroundColor: '#f27a23',
                  '&:hover': { backgroundColor: '#d5671a' },
                }}
              >
                Capture Photo
              </Button>
            </Box>
          )}

          {/* Captured Preview */}
          {previewUrl && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 2,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}
              >
                <img
                  src={previewUrl}
                  alt="Captured Profile Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, width: '100%', maxWidth: '280px' }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  startIcon={<RefreshIcon />}
                  onClick={startCamera}
                  sx={{
                    borderRadius: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}
                >
                  Retake
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={
                    isUploading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />
                  }
                  onClick={uploadCapturedPhoto}
                  disabled={isUploading}
                  sx={{
                    borderRadius: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    backgroundColor: '#10B981',
                    '&:hover': { backgroundColor: '#059669' },
                  }}
                >
                  Use Photo
                </Button>
              </Box>
            </Box>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          {cameraActive && (
            <Button
              variant="text"
              color="inherit"
              onClick={handleCloseDialog}
              sx={{ fontWeight: 'bold' }}
            >
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
