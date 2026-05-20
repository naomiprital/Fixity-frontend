import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Badge,
  alpha,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider,
  IconButton,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../../../hooks/Auth';
import { useMyReports } from '@/hooks/Reports';
import { getCities } from '@/features/auth/api/citiesApi';
import { updateUserProfile, uploadAvatar } from '../../api/services/userApi';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

type City = {
  cityId: number;
  name: string;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: user } = useAuthUser();
  const { data: reports } = useMyReports();

  // Dialog & Photo States
  const [openDialog, setOpenDialog] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form fields when editing starts
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setCityId(user.cityId || '');
    }
  }, [user, isEditing]);

  // Load cities if editing
  useEffect(() => {
    if (isEditing && cities.length === 0) {
      setLoadingCities(true);
      getCities(1, 100)
        .then((res) => {
          setCities(res.items || []);
        })
        .catch(() => {
          toast.error('Failed to load cities list');
        })
        .finally(() => {
          setLoadingCities(false);
        });
    }
  }, [isEditing, cities.length]);

  // Connect video element to stream when stream becomes active
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const rawFirstName = user?.firstName;
  const rawLastName = user?.lastName;
  const initials = (rawFirstName && rawLastName)
    ? `${rawFirstName[0] || ''}${rawLastName[0] || ''}`.toUpperCase()
    : '';
  const fullName = `${rawFirstName} ${rawLastName}`;

  const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000/api';
  const IMAGE_BASE = API_BASE.replace('/api', '');
  const avatarUrl = user?.profilePictureUrl ? `${IMAGE_BASE}${user.profilePictureUrl}` : '';

  const syncLocalAuth = (updatedUser: any) => {
    const rawAuth = localStorage.getItem('fixity.auth');
    if (rawAuth) {
      const parsed = JSON.parse(rawAuth);
      parsed.user = { ...parsed.user, ...updatedUser };
      localStorage.setItem('fixity.auth', JSON.stringify(parsed));
    }
    queryClient.setQueryData(['auth-user'], (old: any) => {
      if (!old) return null;
      return { ...old, ...updatedUser };
    });
  };

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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 320, facingMode: 'user' },
        audio: false,
      });
      setCameraStream(stream);
      setCameraActive(true);
      setCapturedFile(null);
      setPreviewUrl('');
    } catch (err) {
      toast.error('Could not access camera. Please check system permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw frame keeping square aspect ratio
        const size = Math.min(video.videoWidth, video.videoHeight);
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        
        canvas.width = 300;
        canvas.height = 300;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, 300, 300);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured_profile.jpg', { type: 'image/jpeg' });
            setCapturedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const uploadCapturedPhoto = async () => {
    if (!capturedFile) return;

    setIsUploading(true);
    try {
      const res = await uploadAvatar(capturedFile);
      syncLocalAuth(res.user);
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

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File is too large. Limit is 2MB.');
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadAvatar(file);
      syncLocalAuth(res.user);
      toast.success('Profile picture updated successfully!');
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Name fields cannot be empty');
      return;
    }
    if (!email.trim()) {
      toast.error('Email field cannot be empty');
      return;
    }
    if (!cityId) {
      toast.error('Please select a city');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateUserProfile({
        firstName,
        lastName,
        email,
        cityId: Number(cityId),
      });
      syncLocalAuth(res.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fixity.auth');
    navigate('/');
  };

  // Sleek styles for roles
  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'Manager':
        return { bg: '#FFECE0', color: '#f27a23', border: '1px solid #FFCCA8' };
      case 'Official':
        return { bg: '#EBF5FF', color: '#1E40AF', border: '1px solid #BFDBFE' };
      case 'Worker':
        return { bg: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' };
      default:
        return { bg: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' };
    }
  };

  const roleStyle = getRoleStyle(user?.role || 'Citizen');

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
      }}
    >
      {/* Hidden library picker */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleAvatarFileChange}
      />

      <Box>
        {/* Top Header Card */}
        <Box
          sx={{
            backgroundColor: 'primary.dark',
            color: 'white',
            padding: '2rem 1.5rem 2.5rem 1.5rem',
            borderBottomLeftRadius: '2rem',
            borderBottomRightRadius: '2rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 8px 30px rgba(15, 90, 97, 0.15)',
          }}
        >
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

          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2, letterSpacing: '0.5px' }}>
            {fullName}
          </Typography>

          {/* User Role Badge */}
          <Box
            sx={{
              mt: 1,
              px: 1.5,
              py: 0.25,
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              backgroundColor: roleStyle.bg,
              color: roleStyle.color,
              border: roleStyle.border,
            }}
          >
            {user?.role}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, width: '100%', maxWidth: '300px' }}>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f27a23' }}>
                {reports?.length || 0}
              </Typography>
              <Typography variant="caption" sx={{ letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>
                MY REPORTS
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Account Info Card */}
        <Box sx={{ padding: '1.5rem' }}>
          <Card
            sx={{
              borderRadius: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #F1F5F9',
            }}
          >
            <CardContent sx={{ padding: '1.5rem !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', flexGrow: 1 }}>
                  Account Details
                </Typography>
                {!isEditing && (
                  <Button
                    variant="text"
                    color="primary"
                    startIcon={<EditIcon sx={{ fontSize: '1.1rem' }} />}
                    onClick={() => setIsEditing(true)}
                    sx={{ fontWeight: 'bold', textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              {!isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(15, 90, 97, 0.08)', color: 'primary.main', width: 40, height: 40 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {fullName}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(15, 90, 97, 0.08)', color: 'primary.main', width: 40, height: 40 }}>
                      <EmailIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(15, 90, 97, 0.08)', color: 'primary.main', width: 40, height: 40 }}>
                      <LocationOnIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        City
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {user?.cityName || 'Not set'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(15, 90, 97, 0.08)', color: 'primary.main', width: 40, height: 40 }}>
                      <CalendarTodayIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {user?.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}
                  />

                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}
                  />

                  <TextField
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}
                  />

                  <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}>
                    <InputLabel id="city-select-label">City</InputLabel>
                    <Select
                      labelId="city-select-label"
                      value={cityId}
                      label="City"
                      onChange={(e) => setCityId(Number(e.target.value))}
                      disabled={loadingCities}
                    >
                      {loadingCities ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} sx={{ mr: 1 }} /> Loading cities...
                        </MenuItem>
                      ) : (
                        cities.map((city) => (
                          <MenuItem key={city.cityId} value={city.cityId}>
                            {city.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      sx={{
                        borderRadius: '1rem',
                        py: 1.2,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(15, 90, 97, 0.2)',
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      fullWidth
                      startIcon={<CancelIcon />}
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      sx={{
                        borderRadius: '1rem',
                        py: 1.2,
                        fontWeight: 'bold',
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

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
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  startIcon={isUploading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
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

      {/* Log Out Button */}
      <Button
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={(theme) => ({
          borderRadius: '1.5rem',
          padding: '0.8rem',
          fontWeight: 'bold',
          borderWidth: '2px',
          color: theme.palette.error.main,
          borderColor: alpha(theme.palette.error.main, 0.1),
          backgroundColor: 'white',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            borderColor: theme.palette.error.main,
          },
          margin: '1.5rem',
          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.05)',
        })}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default ProfilePage;
