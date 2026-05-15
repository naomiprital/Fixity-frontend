import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    backTo?: string;
}

export const PageHeader = ({ title, backTo }: PageHeaderProps) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                backgroundColor: 'primary.dark',
                color: 'primary.contrastText',
                height: '4rem',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: backTo ? "0" : "1rem"
            }}
        >
            {backTo && <IconButton
                color="inherit"
                onClick={() => navigate(backTo)}
                aria-label={`back to ${backTo}`}
            >
                <ChevronLeftIcon fontSize="large" />
            </IconButton>}
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {title}
            </Typography>
        </Box>
    );
};
