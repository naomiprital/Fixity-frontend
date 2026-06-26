import React from 'react';
import { Card, CardContent, Typography, Button, Box, Stack } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { type Task, WORKER_COLORS } from '../types';

interface TaskCardProps {
  task: Task;
  onClaim: (taskId: number) => void;
}

const getPriorityInfo = (score: string | number) => {
  const s = Number(score);
  if (s > 100) return { label: 'CRITICAL', color: WORKER_COLORS.criticalPriority };
  if (s >= 50) return { label: 'HIGH', color: WORKER_COLORS.highPriority };
  return { label: 'NORMAL', color: WORKER_COLORS.normalPriority };
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClaim }) => {
  const { label, color: priorityColor } = getPriorityInfo(task.incident.priorityScore);

  return (
    <Card
      sx={{
        borderRadius: '16px',
        borderLeft: `6px solid ${priorityColor}`,
        mb: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 'bold',
              color: priorityColor,
              letterSpacing: '0.05em',
            }}
          >
            {label} PRIORITY
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            200m {/* Hardcoded for now as distance logic isn't implemented */}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#2C3E50' }}>
          {task.incident.description}
        </Typography>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 2 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {task.category.name}
          </Typography>
        </Stack>

        <Button
          fullWidth
          variant="contained"
          onClick={() => onClaim(task.taskId)}
          sx={{
            backgroundColor: '#F5F5F5',
            color: WORKER_COLORS.tealHeader,
            borderRadius: '16px',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#EEEEEE',
            },
            boxShadow: 'none',
          }}
        >
          {task.status?.toLowerCase() === 'assigned' ? 'Finish Task' : '+ Claim Task'}
        </Button>
      </CardContent>
    </Card>
  );
};
