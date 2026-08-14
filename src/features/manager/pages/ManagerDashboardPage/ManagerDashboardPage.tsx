import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  fetchManagerReports, fetchIncidents, createIncident, createTask,
  fetchTaskCategories, updateIncident, deleteIncident, closeIncident, updateTask, deleteTask,
  addReportsToIncident, removeReportFromIncident
} from '../../api/managerApi';
import type { Report, Incident, Task, TaskCategory } from '@/types/models';
import { toast } from 'react-toastify';
import { ReportsSection } from './components/ReportsSection';
import { IncidentsSection } from './components/IncidentsSection';
import { CreateIncidentDialog, EditIncidentDialog, DeleteIncidentDialog, CloseIncidentDialog } from './components/IncidentDialogs';
import { EditTaskDialog, DeleteTaskDialog } from './components/TaskDialogs';
import { AddToIncidentDialog } from './components/AddToIncidentDialog';
import './ManagerDashboardPage.css';

export default function ManagerDashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
  const [selectedReportIds, setSelectedReportIds] = useState<number[]>([]);
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [addToIncidentOpen, setAddToIncidentOpen] = useState(false);
  const [incidentDesc, setIncidentDesc] = useState('');
  const [editIncident, setEditIncident] = useState<Incident | null>(null);
  const [editIncidentDesc, setEditIncidentDesc] = useState('');
  const [deleteIncidentId, setDeleteIncidentId] = useState<number | null>(null);
  const [closeIncidentTarget, setCloseIncidentTarget] = useState<Incident | null>(null);
  const [isClosingIncident, setIsClosingIncident] = useState(false);
  const [taskNotes, setTaskNotes] = useState<Record<number, string>>({});
  const [taskCategoryIds, setTaskCategoryIds] = useState<Record<number, number>>({});
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTaskNotes, setEditTaskNotes] = useState('');
  const [editTaskCategoryId, setEditTaskCategoryId] = useState(0);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [isCreatingIncident, setIsCreatingIncident] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [reps, incs, cats] = await Promise.all([
        fetchManagerReports(), fetchIncidents(), fetchTaskCategories(),
      ]);
      setReports(reps);
      setIncidents(incs.sort((a, b) => b.priorityScore - a.priorityScore));
      setTaskCategories(cats);
      setSelectedReportIds([]);
    } catch (e: any) {
      toast.error('Failed to load data: ' + e.message);
    }
  };

  const toggleReport = (id: number) =>
    setSelectedReportIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSelectAll = () => {
    const allSelected = selectedReportIds.length === reports.length;
    setSelectedReportIds(allSelected ? [] : reports.map(r => r.reportId));
  };

  const handleCreateIncident = async () => {
    try {
      setIsCreatingIncident(true);
      await createIncident({ reportIds: selectedReportIds, description: incidentDesc });
      toast.success('Incident created!');
      setIncidentDialogOpen(false);
      setIncidentDesc('');
      loadData();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsCreatingIncident(false);
    }
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

  const handleCloseIncident = async () => {
    if (!closeIncidentTarget) return;
    try {
      setIsClosingIncident(true);
      await closeIncident(closeIncidentTarget.incidentId);
      toast.success('Incident closed successfully!');
      setCloseIncidentTarget(null);
      loadData();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsClosingIncident(false);
    }
  };

  const handleCreateTask = async (incidentId: number) => {
    if (!taskCategoryIds[incidentId]) { toast.error('Select a task category'); return; }
    try {
      await createTask({ incidentId, categoryId: taskCategoryIds[incidentId], workerNotes: taskNotes[incidentId] });
      toast.success('Task created!');
      setTaskNotes(p => ({ ...p, [incidentId]: '' }));
      setTaskCategoryIds(p => ({ ...p, [incidentId]: 0 }));
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

  const handleAddToIncident = async (incidentId: number) => {
    try {
      await addReportsToIncident(incidentId, selectedReportIds);
      toast.success('Reports added to incident!');
      setAddToIncidentOpen(false);
      loadData();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleRemoveReport = async (incidentId: number, reportId: number) => {
    try {
      await removeReportFromIncident(incidentId, reportId);
      toast.success('Report removed from incident');
      loadData();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <Box className="mgr-page">
      <Box className="mgr-header">
        <Box className="mgr-header__inner">
          <AssignmentIcon sx={{ color: 'primary.contrastText', fontSize: '1.6rem' }} />
          <Typography variant="h5" sx={{ color: 'primary.contrastText', fontWeight: 700 }}>
            Manager Dashboard
          </Typography>
        </Box>
      </Box>

      <Box className="mgr-content">
        <ReportsSection
          reports={reports}
          selectedReportIds={selectedReportIds}
          onToggleReport={toggleReport}
          onSelectAll={handleSelectAll}
          onOpenCreateIncident={() => setIncidentDialogOpen(true)}
          onOpenAddToIncident={() => setAddToIncidentOpen(true)}
        />

        <IncidentsSection
          incidents={incidents}
          taskCategories={taskCategories}
          taskNotes={taskNotes}
          taskCategoryIds={taskCategoryIds}
          onTaskNoteChange={(id, v) => setTaskNotes(p => ({ ...p, [id]: v }))}
          onTaskCatChange={(id, v) => setTaskCategoryIds(p => ({ ...p, [id]: v }))}
          onCreateTask={handleCreateTask}
          onEditIncident={inc => { setEditIncident(inc); setEditIncidentDesc(inc.description); }}
          onDeleteIncident={setDeleteIncidentId}
          onCloseIncident={setCloseIncidentTarget}
          onEditTask={openEditTask}
          onDeleteTask={setDeleteTaskId}
          onRemoveReport={handleRemoveReport}
        />
      </Box>

      {/* Incident dialogs */}
      <CreateIncidentDialog
        open={incidentDialogOpen}
        selectedCount={selectedReportIds.length}
        description={incidentDesc}
        onDescriptionChange={setIncidentDesc}
        onConfirm={handleCreateIncident}
        onClose={() => setIncidentDialogOpen(false)}
        loading={isCreatingIncident}
      />
      <EditIncidentDialog
        incident={editIncident}
        description={editIncidentDesc}
        onDescriptionChange={setEditIncidentDesc}
        onConfirm={handleUpdateIncident}
        onClose={() => setEditIncident(null)}
      />
      <DeleteIncidentDialog
        incidentId={deleteIncidentId}
        onConfirm={handleDeleteIncident}
        onClose={() => setDeleteIncidentId(null)}
      />
      <CloseIncidentDialog
        incident={closeIncidentTarget}
        onConfirm={handleCloseIncident}
        onClose={() => setCloseIncidentTarget(null)}
        loading={isClosingIncident}
      />

      <AddToIncidentDialog
        open={addToIncidentOpen}
        incidents={incidents}
        onAdd={handleAddToIncident}
        onClose={() => setAddToIncidentOpen(false)}
      />

      {/* Task dialogs */}
      <EditTaskDialog
        task={editTask}
        taskCategories={taskCategories}
        notes={editTaskNotes}
        categoryId={editTaskCategoryId}
        onNotesChange={setEditTaskNotes}
        onCategoryChange={setEditTaskCategoryId}
        onConfirm={handleUpdateTask}
        onClose={() => setEditTask(null)}
      />
      <DeleteTaskDialog
        taskId={deleteTaskId}
        onConfirm={handleDeleteTask}
        onClose={() => setDeleteTaskId(null)}
      />
    </Box>
  );
}
