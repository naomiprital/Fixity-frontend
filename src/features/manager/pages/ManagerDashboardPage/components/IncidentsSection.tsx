import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
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
  onCloseIncident?: (inc: Incident) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  onRemoveReport: (incidentId: number, reportId: number) => void;
}

export function IncidentsSection({
  incidents, taskCategories,
  taskNotes, taskCategoryIds,
  onTaskNoteChange, onTaskCatChange, onCreateTask,
  onEditIncident, onDeleteIncident, onCloseIncident,
  onEditTask, onDeleteTask,
  onRemoveReport,
}: Props) {
  const [filter, setFilter] = useState<'active' | 'closed' | 'all'>('active');

  const activeIncidents = incidents.filter(i => i.status !== 'Closed');
  const closedIncidents = incidents.filter(i => i.status === 'Closed');

  const displayedIncidents = filter === 'active'
    ? activeIncidents
    : filter === 'closed'
      ? closedIncidents
      : incidents;

  return (
    <Box className="mgr-section">
      <Box className="mgr-section__title-row" sx={{ mb: 1.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Incidents</Typography>
        </Box>

        <Tabs
          value={filter}
          onChange={(_, val) => setFilter(val)}
          sx={{
            minHeight: '2rem',
            '& .MuiTab-root': {
              minHeight: '2rem',
              px: 1.5,
              py: 0.5,
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: '0.5rem',
              textTransform: 'none',
            },
          }}
        >
          <Tab value="active" label={`Active (${activeIncidents.length})`} />
          <Tab value="closed" label={`Past (${closedIncidents.length})`} />
          <Tab value="all" label={`All (${incidents.length})`} />
        </Tabs>
      </Box>

      {displayedIncidents.length === 0 && (
        <Typography sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
          {filter === 'active'
            ? 'No active incidents. Select reports above to create one.'
            : filter === 'closed'
              ? 'No past / closed incidents found.'
              : 'No incidents found.'}
        </Typography>
      )}

      {displayedIncidents.map(inc => (
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
          onCloseIncident={onCloseIncident}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onRemoveReport={onRemoveReport}
        />
      ))}
    </Box>
  );
}
