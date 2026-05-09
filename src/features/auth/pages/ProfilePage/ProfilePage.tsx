import { Box, Typography, Avatar, Button, Badge, alpha } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../../../hooks/Auth';
import { useMyReports } from '@/hooks/Reports';

const ProfilePage = () => {
    const navigate = useNavigate();

    const { data: user } = useAuthUser();
    const { data: reports } = useMyReports();

    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const initials = (firstName && lastName) ? `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() : '';
    const fullName = `${firstName} ${lastName}`;

    const handleLogout = () => {
        localStorage.removeItem('fixity.auth');
        navigate('/');
    };

    return (
        <Box sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: "space-between" }}>
            <Box sx={{
                backgroundColor: 'primary.dark',
                color: 'white',
                padding: '1.5rem 1.5rem 2rem 1.5rem',
                borderBottomLeftRadius: '2rem',
                borderBottomRightRadius: '2rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <Box sx={{
                            backgroundColor: '#f27a23',
                            borderRadius: '50%',
                            padding: '4px',
                            display: 'flex',
                            border: '3px solid',
                            borderColor: "primary.dark"
                        }}>
                            <StarIcon sx={{ fontSize: '1rem', color: 'white' }} />
                        </Box>
                    }
                >
                    <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', backgroundColor: '#e0e0e0', color: '#757575', fontWeight: 'bold' }}>
                        {initials}
                    </Avatar>
                </Badge>

                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1.5 }}>{fullName}</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>{user?.cityName} • {user?.role}</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5, width: '100%', maxWidth: '300px' }}>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{reports?.length}</Typography>
                        <Typography variant="caption" sx={{ letterSpacing: 1 }}>REPORTS</Typography>
                    </Box>
                </Box>
            </Box>
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
                    '&:hover': { borderWidth: '2px', backgroundColor: alpha(theme.palette.error.main, 0.1), borderColor: theme.palette.error.main },
                    margin: "1.5rem"
                })}
            >
                Log Out
            </Button>
        </Box>
    );
};

export default ProfilePage;
