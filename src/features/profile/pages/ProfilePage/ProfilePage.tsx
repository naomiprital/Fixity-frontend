import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  alpha,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Avatar,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '@/features/auth/hooks/useAuth';
import { useMyReports } from '@/features/reports/hooks/useReports';
import { getCities } from '@/features/auth/api/citiesApi';
import { updateUserProfile } from '@/features/profile/api/userApi';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar/ProfileAvatar';
import type { City } from '@/types/models';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useAuthUser();
  const { data: reports } = useMyReports();

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cityId, setCityId] = useState<number | ''>('');
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    if (isEditing && user?.role === 'Citizen' && cities.length === 0) {
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
  }, [isEditing, user?.role, cities.length]);

  const rawFirstName = user?.firstName;
  const rawLastName = user?.lastName;
  const fullName = `${rawFirstName} ${rawLastName}`;

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

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Name fields cannot be empty');
      return;
    }
    if (!email.trim()) {
      toast.error('Email field cannot be empty');
      return;
    }
    if (user?.role === 'Citizen' && !cityId) {
      toast.error('Please select a city');
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        firstName,
        lastName,
        email,
      };
      if (user?.role === 'Citizen') {
        payload.cityId = Number(cityId);
      }
      const res = await updateUserProfile(payload);
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
    <Box className="profile-page">
      <Box>
        {/* Top Header Card */}
        <Box className="profile-page__header">
          {/* Sub-component ProfileAvatar handles all image logic, dialog & webcam */}
          <ProfileAvatar user={user} onUploadSuccess={syncLocalAuth} />

          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2, letterSpacing: '0.5px' }}>
            {fullName}
          </Typography>

          {/* User Role Badge */}
          <Box
            className="profile-page__role-badge"
            sx={{
              backgroundColor: roleStyle.bg,
              color: roleStyle.color,
              border: roleStyle.border,
            }}
          >
            {user?.role}
          </Box>

          <Box className="profile-page__stats">
            <Box className="profile-page__stat-item">
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f27a23' }}>
                {reports?.length || 0}
              </Typography>
              <Typography
                variant="caption"
                sx={{ letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}
              >
                MY REPORTS
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Account Info Card */}
        <Box className="profile-page__content">
          <Card className="profile-page__card">
            <CardContent className="profile-page__card-content">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" className="profile-page__details-title" sx={{ color: 'text.primary' }}>
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
                <Box className="profile-page__detail-list">
                  <Box className="profile-page__detail-item">
                    <Avatar className="profile-page__detail-avatar">
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1" className="profile-page__detail-text">
                        {fullName}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box className="profile-page__detail-item">
                    <Avatar className="profile-page__detail-avatar">
                      <EmailIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1" className="profile-page__detail-text">
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box className="profile-page__detail-item">
                    <Avatar className="profile-page__detail-avatar">
                      <LocationOnIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        City
                      </Typography>
                      <Typography variant="body1" className="profile-page__detail-text">
                        {user?.cityName || 'Not set'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <Box className="profile-page__detail-item">
                    <Avatar className="profile-page__detail-avatar">
                      <CalendarTodayIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1" className="profile-page__detail-text">
                        {user?.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box className="profile-page__edit-form">
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="profile-page__form-field"
                  />

                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="profile-page__form-field"
                  />

                  <TextField
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="profile-page__form-field"
                  />

                  {user?.role === 'Citizen' ? (
                    <FormControl fullWidth className="profile-page__form-field">
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
                  ) : (
                    <TextField
                      label="City"
                      variant="outlined"
                      fullWidth
                      value={user?.cityName || 'Not set'}
                      disabled
                      helperText="Only citizens can change their city"
                      className="profile-page__form-field"
                    />
                  )}

                  <Box className="profile-page__form-actions">
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="profile-page__save-btn"
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
                      className="profile-page__cancel-btn"
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

      {/* Log Out Button */}
      <Button
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        className="profile-page__logout-btn"
        sx={(theme) => ({
          color: theme.palette.error.main,
          borderColor: alpha(theme.palette.error.main, 0.1),
          '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            borderColor: theme.palette.error.main,
          },
        })}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default ProfilePage;
