import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { type Task, WORKER_COLORS } from '../types';

interface ActiveTaskFooterProps {
  task: Task;
  onFinish: () => void;
}

export const ActiveTaskFooter: React.FC<ActiveTaskFooterProps> = ({ task, onFinish }) => {
  return (
    <Paper
      elevation={10}
      sx={{
        position: 'fixed',
        bottom: 80,
        left: 16,
        right: 16,
        backgroundColor: WORKER_COLORS.darkBlueFooter,
        borderRadius: '16px',
        p: 2,
        color: 'white',
        zIndex: 1000,
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <ConstructionIcon sx={{ fontSize: '28px', color: 'white' }} />
            <Box
              sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 10,
                height: 10,
                backgroundColor: WORKER_COLORS.successGreen,
                borderRadius: '50%',
                border: '2px solid #2C4364',
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                opacity: 0.8,
                fontWeight: 'bold',
                letterSpacing: '0.05em',
              }}
            >
              IN PROGRESS
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {task.incident.description}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          onClick={onFinish}
          sx={{
            backgroundColor: WORKER_COLORS.successGreen,
            color: 'white',
            borderRadius: '16px',
            px: 4,
            py: 1,
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#27ae60',
            },
          }}
        >
          Finish
        </Button>
      </Stack>
    </Paper>
  );
};
