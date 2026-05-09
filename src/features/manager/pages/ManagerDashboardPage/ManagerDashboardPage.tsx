import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Chip, Accordion, AccordionSummary, AccordionDetails,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip,
  useTheme, useMediaQuery, darken,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
  fetchManagerReports, fetchIncidents, createIncident, createTask,
  fetchTaskCategories, updateIncident, deleteIncident, updateTask, deleteTask,
} from '../../api/managerApi';
import type { Report, Incident, Task, TaskCategory } from '@/types/models';
import { toast } from 'react-toastify';
import './ManagerDashboardPage.css';

const statusColor = (status: string) => {
  if (status === 'Open') return { bg: '#e8f5e9', text: '#2e7d32' };
  if (status === 'InProgress') return { bg: '#fff8e1', text: '#f57f17' };
  return { bg: '#fce4ec', text: '#b71c1c' };
};

export default function ManagerDashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [reports, setReports] = useState<Report[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
  const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [incidentDesc, setIncidentDesc] = useState('');
  const [editIncident, setEditIncident] = useState<Incident | null>(null);
  const [editIncidentDesc, setEditIncidentDesc] = useState('');
  const [deleteIncidentId, setDeleteIncidentId] = useState<number | null>(null);
  const [taskNotes, setTaskNotes] = useState<Record<number, string>>({});
  const [taskCategoryId, setTaskCategoryId] = useState<Record<number, number>>({});
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTaskNotes, setEditTaskNotes] = useState('');
  const [editTaskCategoryId, setEditTaskCategoryId] = useState<number>(0);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [reps, incs, cats] = await Promise.all([
        fetchManagerReports(), fetchIncidents(), fetchTaskCategories(),
      ]);
      setReports(reps);
      setIncidents(incs);
      setTaskCategories(cats);
      setSelectedReportIds([]);
    } catch (e: any) {
      toast.error('Failed to load data: ' + e.message);
    }
  };

  const toggleReport = (id: number) =>
    setSelectedReportIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const allSelected = reports.length > 0 && selectedReportIds.length === reports.length;
  const someSelected = selectedReportIds.length > 0 && !allSelected;

  const handleCreateIncident = async () => {
    try {
      await createIncident({ reportIds: selectedReportIds, description: incidentDesc });
      toast.success('Incident created!');
      setIncidentDialogOpen(false);
      setIncidentDesc('');
      loadData();
    } catch (e: any) { toast.error(e.message); }
  };

  const openEditIncident = (inc: Incident) => {
    setEditIncident(inc);
    setEditIncidentDesc(inc.description);
  };
  const handleUpdateIncident = async () => {
    if (!editIncident) return;
    try {
      await updateIncident(editIncident.incidentId, { description: editIncidentDesc });
      toast.success('Incident updated!');
      setEditIncident(null);
      loadData();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDeleteIncident = async () => {
    if (!deleteIncidentId) return;
    try {
      await deleteIncident(deleteIncidentId);
      toast.success('Incident deleted');
      setDeleteIncidentId(null);
      loadData();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleCreateTask = async (incidentId: number) => {
    if (!taskCategoryId[incidentId]) { toast.error('Select a task category'); return; }
    try {
      await createTask({ incidentId, categoryId: taskCategoryId[incidentId], workerNotes: taskNotes[incidentId] });
      toast.success('Task created!');
      setTaskNotes(p => ({ ...p, [incidentId]: '' }));
      setTaskCategoryId(p => ({ ...p, [incidentId]: 0 }));
      loadData();
    } catch (e: any) { toast.error(e.message); }
  };

  const openEditTask = (t: Task) => {
    setEditTask(t);
    setEditTaskNotes(t.workerNotes || '');
    setEditTaskCategoryId(t.categoryId);
  };
  const handleUpdateTask = async () => {
    if (!editTask) return;
    try {
      await updateTask(editTask.taskId, { workerNotes: editTaskNotes, categoryId: editTaskCategoryId });
      toast.success('Task updated!');
      setEditTask(null);
      loadData();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    try {
      await deleteTask(deleteTaskId);
      toast.success('Task deleted');
      setDeleteTaskId(null);
      loadData();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <Box className="mgr-page">
      {/* Page Header */}
      <Box className="mgr-header">
        <Box className="mgr-header__inner">
          <AssignmentIcon sx={{ color: 'primary.contrastText', fontSize: '1.6rem' }} />
          <Typography variant="h5" sx={{ color: 'primary.contrastText', fontWeight: 700 }}>
            Manager Dashboard
          </Typography>
        </Box>
      </Box>

      <Box className="mgr-content">
        {/* ── Open Reports Section ── */}
        <Box className="mgr-section">
          <Box className="mgr-section__title-row">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReportProblemOutlinedIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Open Reports
              </Typography>
              <Chip label={reports.length} size="small" sx={{ bgcolor: 'secondary.main', color: '#fff', fontWeight: 700 }} />
            </Box>
            <Button
              variant="contained"
              size={isMobile ? 'small' : 'medium'}
              disabled={selectedReportIds.length === 0}
              onClick={() => setIncidentDialogOpen(true)}
              sx={{
                bgcolor: 'primary.main', color: '#fff', borderRadius: '0.75rem', fontWeight: 700,
                '&:hover': { bgcolor: (t) => darken(t.palette.primary.main, 0.2) },
                '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
              }}
            >
              {isMobile ? 'New Incident' : `Create Incident (${selectedReportIds.length} selected)`}
            </Button>
          </Box>

          {/* Select-all row */}
          {reports.length > 0 && (
            <Box
              className="mgr-select-all"
              onClick={() => setSelectedReportIds(allSelected ? [] : reports.map(r => r.reportId))}
            >
              <IconButton size="small" sx={{ color: someSelected || allSelected ? 'primary.main' : 'text.disabled' }}>
                {allSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
              </IconButton>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                {allSelected ? 'Deselect all' : 'Select all'}
              </Typography>
            </Box>
          )}

          {/* Report cards */}
          <Box className="mgr-report-list">
            {reports.length === 0 && (
              <Typography sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
                No open unassigned reports.
              </Typography>
            )}
            {reports.map(r => {
              const selected = selectedReportIds.includes(r.reportId);
              return (
                <Box
                  key={r.reportId}
                  className={`mgr-report-card${selected ? ' mgr-report-card--selected' : ''}`}
                  onClick={() => toggleReport(r.reportId)}
                >
                  <IconButton size="small" sx={{ color: selected ? 'primary.main' : 'text.disabled', flexShrink: 0 }}>
                    {selected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                  </IconButton>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.25 }}>
                      <Chip label={r.category?.name} size="small" sx={{ bgcolor: 'surface.main', fontWeight: 600, fontSize: '0.72rem' }} />
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        #{r.reportId} · {new Date(r.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.primary', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {r.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {r.requester?.firstName} {r.requester?.lastName}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ── Active Incidents Section ── */}
        <Box className="mgr-section">
          <Box className="mgr-section__title-row" sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Active Incidents
              </Typography>
              <Chip label={incidents.length} size="small" sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 700 }} />
            </Box>
          </Box>

          {incidents.length === 0 && (
            <Typography sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
              No incidents yet. Select reports above and create one.
            </Typography>
          )}

          {incidents.map(inc => (
            <Accordion key={inc.incidentId} className="mgr-accordion" disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} className="mgr-accordion__summary">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0, pr: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {inc.description || `Incident #${inc.incidentId}`}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {inc.reports.length} report{inc.reports.length !== 1 ? 's' : ''} · {inc.tasks.length} task{inc.tasks.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <Tooltip title="Edit incident">
                      <IconButton
                        size="small" color="primary"
                        onClick={e => { e.stopPropagation(); openEditIncident(inc); }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete incident">
                      <IconButton
                        size="small" color="error"
                        onClick={e => { e.stopPropagation(); setDeleteIncidentId(inc.incidentId); }}
                      >
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
                  {inc.reports.map(r => (
                    <Box key={r.reportId} className="mgr-linked-item">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>#{r.reportId}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>{r.description}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Tasks */}
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em', mt: 2, display: 'block' }}>
                  Tasks
                </Typography>
                <Box className="mgr-task-list">
                  {inc.tasks.length === 0 && (
                    <Typography variant="body2" sx={{ color: 'text.disabled', py: 1 }}>No tasks yet.</Typography>
                  )}
                  {inc.tasks.map(t => {
                    const sc = statusColor(t.status);
                    return (
                      <Box key={t.taskId} className="mgr-task-card">
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Show incident description as task title */}
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {inc.description || `Incident #${inc.incidentId}`}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.25 }}>
                            <Chip label={t.category?.name || 'Uncategorised'} size="small" sx={{ bgcolor: 'surface.main', fontWeight: 600, fontSize: '0.68rem' }} />
                            <Chip
                              label={t.status}
                              size="small"
                              sx={{ bgcolor: sc.bg, color: sc.text, fontWeight: 700, fontSize: '0.68rem' }}
                            />
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
                            <IconButton size="small" color="primary" onClick={() => openEditTask(t)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete task">
                            <IconButton size="small" color="error" onClick={() => setDeleteTaskId(t.taskId)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Create Task inline form */}
                <Box className="mgr-create-task">
                  <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em', mb: 1, display: 'block' }}>
                    New Task
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      value={taskCategoryId[inc.incidentId] || ''}
                      onChange={e => setTaskCategoryId(p => ({ ...p, [inc.incidentId]: Number(e.target.value) }))}
                      sx={{ bgcolor: 'background.paper', borderRadius: '0.5rem' }}
                    >
                      {taskCategories.map(cat => (
                        <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    size="small" label="Worker Notes" fullWidth multiline rows={2}
                    value={taskNotes[inc.incidentId] || ''}
                    onChange={e => setTaskNotes(p => ({ ...p, [inc.incidentId]: e.target.value }))}
                    sx={{ mb: 1, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: '0.5rem' } }}
                  />
                  <Button
                    variant="contained" startIcon={<AddTaskIcon />} size="small"
                    onClick={() => handleCreateTask(inc.incidentId)}
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
          ))}
        </Box>
      </Box>

      {/* ── Create Incident Dialog ── */}
      <Dialog open={incidentDialogOpen} onClose={() => setIncidentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Create Incident</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, color: 'text.secondary' }}>
            Creating incident from <strong>{selectedReportIds.length}</strong> selected report(s).
          </Typography>
          <TextField
            autoFocus label="Description" fullWidth multiline rows={3}
            value={incidentDesc}
            onChange={e => setIncidentDesc(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setIncidentDialogOpen(false)} sx={{ borderRadius: '0.75rem' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleCreateIncident}
            sx={{ bgcolor: 'primary.main', borderRadius: '0.75rem', fontWeight: 700, '&:hover': { bgcolor: (t) => darken(t.palette.primary.main, 0.2) } }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Incident Dialog ── */}
      <Dialog open={!!editIncident} onClose={() => setEditIncident(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Edit Incident</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus label="Description" fullWidth multiline rows={3}
            value={editIncidentDesc}
            onChange={e => setEditIncidentDesc(e.target.value)}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setEditIncident(null)} sx={{ borderRadius: '0.75rem' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleUpdateIncident}
            sx={{ bgcolor: 'primary.main', borderRadius: '0.75rem', fontWeight: 700, '&:hover': { bgcolor: (t) => darken(t.palette.primary.main, 0.2) } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Incident Confirm ── */}
      <Dialog open={!!deleteIncidentId} onClose={() => setDeleteIncidentId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Delete Incident?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            This will delete all linked tasks and unlink all reports. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteIncidentId(null)} sx={{ borderRadius: '0.75rem' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteIncident} sx={{ borderRadius: '0.75rem', fontWeight: 700 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Task Dialog ── */}
      <Dialog open={!!editTask} onClose={() => setEditTask(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Edit Task</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={editTaskCategoryId || ''}
              onChange={e => setEditTaskCategoryId(Number(e.target.value))}
              sx={{ borderRadius: '0.5rem' }}
            >
              {taskCategories.map(cat => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Worker Notes" fullWidth multiline rows={3}
            value={editTaskNotes}
            onChange={e => setEditTaskNotes(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0.5rem' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setEditTask(null)} sx={{ borderRadius: '0.75rem' }}>Cancel</Button>
          <Button
            variant="contained" onClick={handleUpdateTask}
            sx={{ bgcolor: 'primary.main', borderRadius: '0.75rem', fontWeight: 700, '&:hover': { bgcolor: (t) => darken(t.palette.primary.main, 0.2) } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Task Confirm ── */}
      <Dialog open={!!deleteTaskId} onClose={() => setDeleteTaskId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700 }}>Delete Task?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteTaskId(null)} sx={{ borderRadius: '0.75rem' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteTask} sx={{ borderRadius: '0.75rem', fontWeight: 700 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
