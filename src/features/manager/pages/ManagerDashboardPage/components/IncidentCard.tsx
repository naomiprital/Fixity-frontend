import { useState } from 'react';

import {
  Box, Typography, Chip, Accordion, AccordionSummary, AccordionDetails,
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  IconButton, Tooltip, darken,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import type { Incident, Task, TaskCategory } from '@/types/models';
import { WORKER_COLORS } from '../../../../worker/types';

const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000/api';
const IMAGE_BASE = API_BASE.replace('/api', '');

function ExpandableTextWithDialog({ text, limit = 150, variant = 'body2', sx = {} }: { text: string; limit?: number; variant?: string; sx?: any }) {
  const [open, setOpen] = useState(false);
  const truncated = text.length > limit ? `${text.substring(0, limit)}...` : text;

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Typography variant={variant as any} sx={sx}>
        {truncated}{' '}
        {text.length > limit && (
          <Box
            component="span"
            onClick={handleOpen}
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              cursor: 'pointer',
              ml: 0.5,
              fontSize: '0.75em',
              textTransform: 'uppercase',
            }}
          >
            Read More
          </Box>
        )}
      </Typography>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Report Description</DialogTitle>
        <DialogContent dividers>
          <Typography variant={variant as any}>{text}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}



const getPriorityInfo = (score: number) => {
  if (score > 100) return { label: 'CRITICAL', color: WORKER_COLORS.criticalPriority };
  if (score >= 50) return { label: 'HIGH', color: WORKER_COLORS.highPriority };
  return { label: 'NORMAL', color: WORKER_COLORS.normalPriority };
};

const statusColor = (status: string) => {
  if (status === 'Open') return { bg: '#e8f5e9', text: '#2e7d32' };
  if (status === 'InProgress') return { bg: '#fff8e1', text: '#f57f17' };
  return { bg: '#fce4ec', text: '#b71c1c' };
};

interface Props {
  incident: Incident;
  taskCategories: TaskCategory[];
  taskNote: string;
  taskCatId: number;
  onTaskNoteChange: (value: string) => void;
  onTaskCatChange: (value: number) => void;
  onCreateTask: () => void;
  onEditIncident: (inc: Incident) => void;
  onDeleteIncident: (id: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onRemoveReport?: (incidentId: number, reportId: number) => void;
}

export function IncidentCard({
  incident, taskCategories,
  taskNote, taskCatId,
  onTaskNoteChange, onTaskCatChange, onCreateTask,
  onEditIncident, onDeleteIncident,
  onEditTask, onDeleteTask,
  onRemoveReport,
}: Props) {
  return (
    <Accordion className="mgr-accordion" disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className="mgr-accordion__summary">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0, pr: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {incident.description || `Incident #${incident.incidentId}`}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {incident.reports.length} report{incident.reports.length !== 1 ? 's' : ''} · {incident.tasks.length} task{incident.tasks.length !== 1 ? 's' : ''}
            </Typography>
            <Chip
              label={getPriorityInfo(incident.priorityScore).label}
              size="small"
              sx={{
                height: 16,
                fontSize: '0.65rem',
                fontWeight: 800,
                ml: 1,
                bgcolor: getPriorityInfo(incident.priorityScore).color,
                color: '#fff'
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            <Tooltip title="Edit incident">
              <IconButton size="small" color="primary" onClick={e => { e.stopPropagation(); onEditIncident(incident); }}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete incident">
              <IconButton size="small" color="error" onClick={e => { e.stopPropagation(); onDeleteIncident(incident.incidentId); }}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails className="mgr-accordion__details">
        {/* Linked reports */}
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em' }}>
          Linked Reports
        </Typography>
        <Box className="mgr-linked-list">
          {incident.reports.map(r => (
            <Box key={r.reportId} className="mgr-linked-item" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flex: 1, minWidth: 0 }}>
                <Box
                  component="img"
                  src={r.beforeImageUrl ? `${IMAGE_BASE}${r.beforeImageUrl}` : 'https://placehold.co/48'}
                  alt={r.description}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '0.375rem',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: '1px solid #d8dbe0',
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== 'https://placehold.co/48') {
                      target.src = 'https://placehold.co/48';
                    }
                  }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', lineHeight: 1.2 }}>#{r.reportId}</Typography>
                  <ExpandableTextWithDialog
                    text={r.description}
                    limit={120}
                    variant="body2"
                    sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.3 }}
                  />
                </Box>
              </Box>
              <Tooltip title="Remove from incident">
                <IconButton size="small" color="error" onClick={() => onRemoveReport?.(incident.incidentId, r.reportId)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>

        {/* Task list */}
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em', mt: 2, display: 'block' }}>
          Tasks
        </Typography>
        <Box className="mgr-task-list">
          {incident.tasks.length === 0 && (
            <Typography variant="body2" sx={{ color: 'text.disabled', py: 1 }}>No tasks yet.</Typography>
          )}
          {incident.tasks.map(t => {
            const sc = statusColor(t.status);
            return (
              <Box key={t.taskId} className="mgr-task-card">
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Incident description serves as task title */}
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {incident.description || `Incident #${incident.incidentId}`}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.25 }}>
                    <Chip label={t.category?.name || 'Uncategorised'} size="small" sx={{ bgcolor: 'surface.main', fontWeight: 600, fontSize: '0.68rem' }} />
                    <Chip label={t.status} size="small" sx={{ bgcolor: sc.bg, color: sc.text, fontWeight: 700, fontSize: '0.68rem' }} />
                    {t.assignedWorker && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        👷 {t.assignedWorker.firstName} {t.assignedWorker.lastName}
                      </Typography>
                    )}
                  </Box>
                  {t.workerNotes && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', display: 'block', mt: 0.25 }}>
                      {t.workerNotes}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
                  <Tooltip title="Edit task">
                    <IconButton size="small" color="primary" onClick={() => onEditTask(t)}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete task">
                    <IconButton size="small" color="error" onClick={() => onDeleteTask(t.taskId)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Create Task form */}
        <Box className="mgr-create-task">
          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em', mb: 1, display: 'block' }}>
            New Task
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 1 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={taskCatId || ''}
              onChange={e => onTaskCatChange(Number(e.target.value))}
              sx={{ bgcolor: 'background.paper', borderRadius: '0.5rem' }}
            >
              {taskCategories.map(cat => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small" label="Worker Notes" fullWidth multiline rows={2}
            value={taskNote}
            onChange={e => onTaskNoteChange(e.target.value)}
            sx={{ mb: 1, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: '0.5rem' } }}
          />
          <Button
            variant="contained" startIcon={<AddTaskIcon />} size="small"
            onClick={onCreateTask}
            sx={{
              bgcolor: 'primary.main', color: '#fff', borderRadius: '0.75rem', fontWeight: 700,
              '&:hover': { bgcolor: (t) => darken(t.palette.primary.main, 0.2) },
            }}
          >
            Add Task
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
