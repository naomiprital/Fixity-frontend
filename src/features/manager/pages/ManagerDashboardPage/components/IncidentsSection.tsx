import { Box, Typography, Chip } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import type { Incident, Task, TaskCategory } from '@/types/models';
import { IncidentCard } from './IncidentCard';

interface Props {
  incidents: Incident[];
  taskCategories: TaskCategory[];
  taskNotes: Record<number, string>;
  taskCategoryIds: Record<number, number>;
  onTaskNoteChange: (incidentId: number, value: string) => void;
  onTaskCatChange: (incidentId: number, value: number) => void;
  onCreateTask: (incidentId: number) => void;
  onEditIncident: (inc: Incident) => void;
  onDeleteIncident: (id: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
}

export function IncidentsSection({
  incidents, taskCategories,
  taskNotes, taskCategoryIds,
  onTaskNoteChange, onTaskCatChange, onCreateTask,
  onEditIncident, onDeleteIncident,
  onEditTask, onDeleteTask,
}: Props) {
  return (
    <Box className="mgr-section">
      <Box className="mgr-section__title-row" sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Active Incidents</Typography>
          <Chip label={incidents.length} size="small" sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 700 }} />
        </Box>
      </Box>

      {incidents.length === 0 && (
        <Typography sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
          No incidents yet. Select reports above and create one.
        </Typography>
      )}

      {incidents.map(inc => (
        <IncidentCard
          key={inc.incidentId}
          incident={inc}
          taskCategories={taskCategories}
          taskNote={taskNotes[inc.incidentId] || ''}
          taskCatId={taskCategoryIds[inc.incidentId] || 0}
          onTaskNoteChange={v => onTaskNoteChange(inc.incidentId, v)}
          onTaskCatChange={v => onTaskCatChange(inc.incidentId, v)}
          onCreateTask={() => onCreateTask(inc.incidentId)}
          onEditIncident={onEditIncident}
          onDeleteIncident={onDeleteIncident}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </Box>
  );
}
