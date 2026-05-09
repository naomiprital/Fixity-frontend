import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CircularProgress, IconButton, Button, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TaskCard } from '../components/TaskCard';
import { CloseTaskScreen } from '../components/CloseTaskScreen';
import { workerApi } from '../api/workerApi';
import { type Task, WORKER_COLORS } from '../types';
import { toast } from 'react-toastify';

interface WorkerTasksViewProps {
  mode: 'pool' | 'myTasks';
}

// Custom icons for markers (Pin shape)
const createIcon = (color: string) => {
  return new L.DivIcon({
    html: `
      <div style="
        background-color: ${color}; 
        width: 30px; 
        height: 30px; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        border: 2px solid white; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px; 
          height: 10px; 
          background-color: white; 
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const highIcon = createIcon(WORKER_COLORS.highPriority);
const mediumIcon = createIcon(WORKER_COLORS.mediumPriority);
const lowIcon = createIcon(WORKER_COLORS.lowPriority);

const getPriorityIcon = (score: string | number) => {
  const s = Number(score);
  if (s >= 4) return highIcon;
  if (s >= 3) return mediumIcon;
  return lowIcon;
};

export const WorkerTasksView: React.FC<WorkerTasksViewProps> = ({ mode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [mode]);

  const fetchTasks = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await workerApi.getTasks();
      setTasks(data);
      
      const assigned = data.find((t) => t.status?.toLowerCase() === 'assigned');
      if (assigned) setActiveTask(assigned);
      else setActiveTask(null);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleClaim = async (taskId: number) => {
    try {
      const updatedTask = await workerApi.claimTask(taskId);
      setSelectedTask(null);
      toast.success('Task claimed successfully!');
      // Update local state immediately for better UX
      setTasks(prev => prev.map(t => t.taskId === taskId ? updatedTask : t));
      setActiveTask(updatedTask);
      // Then refresh from server
      fetchTasks(false);
    } catch (error) {
      toast.error('Failed to claim task');
    }
  };

  const handleFinish = (task: Task) => {
    setActiveTask(task);
    setIsClosing(true);
  };

  const handleResolve = async (cityResponse: string, afterImageFile: File | null) => {
    if (!activeTask || !afterImageFile) return;
    try {
      setLoading(true);
      await workerApi.uploadImage(activeTask.taskId, afterImageFile);
      await workerApi.resolveTask(activeTask.taskId, cityResponse);
      toast.success('Task marked as resolved!');
      setActiveTask(null);
      setSelectedTask(null);
      setIsClosing(false);
      await fetchTasks(true);
    } catch (error) {
      toast.error('Failed to resolve task');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fixity.auth');
    navigate('/');
  };

  if (isClosing && activeTask) {
    return (
      <CloseTaskScreen
        task={activeTask}
        onBack={() => setIsClosing(false)}
        onResolve={handleResolve}
      />
    );
  }

  const filteredTasks = tasks.filter((t) => 
    mode === 'pool' ? t.status?.toLowerCase() === 'open' : t.status?.toLowerCase() === 'assigned'
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FA', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: WORKER_COLORS.tealHeader,
          color: 'white',
          p: 2,
          pt: 4,
          borderRadius: '0 0 24px 24px',
          zIndex: 1000,
        }}
      >
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {mode === 'pool' ? 'Task Pool' : 'My Tasks'}
          </Typography>
          <IconButton onClick={handleLogout} sx={{ color: 'white' }}>
            <LogoutIcon />
          </IconButton>
        </Stack>

        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', p: 0.5, display: 'flex' }}>
          <Button 
            fullWidth 
            onClick={() => setView('list')}
            sx={{ 
              backgroundColor: view === 'list' ? 'white' : 'transparent', 
              color: view === 'list' ? WORKER_COLORS.tealHeader : 'white', 
              borderRadius: '10px', 
              textTransform: 'none', 
              fontWeight: 'bold', 
              '&:hover': { backgroundColor: view === 'list' ? 'white' : 'rgba(255,255,255,0.1)' } 
            }}
          >
            List
          </Button>
          <Button 
            fullWidth 
            onClick={() => setView('map')}
            sx={{ 
              backgroundColor: view === 'map' ? 'white' : 'transparent', 
              color: view === 'map' ? WORKER_COLORS.tealHeader : 'white', 
              borderRadius: '10px', 
              textTransform: 'none', 
              fontWeight: 'bold', 
              '&:hover': { backgroundColor: view === 'map' ? 'white' : 'rgba(255,255,255,0.1)' } 
            }}
          >
            Map
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      ) : view === 'list' ? (
        <Container maxWidth="sm" sx={{ flexGrow: 1, pt: 3, pb: 10, overflowY: 'auto' }}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard 
                key={task.taskId} 
                task={task} 
                onClaim={() => mode === 'pool' ? handleClaim(task.taskId) : handleFinish(task)} 
              />
            ))
          ) : (
            <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.6 }}>
              <Typography variant="h6">No tasks found</Typography>
              <Typography variant="body2">
                {mode === 'pool' ? 'Check back later for new tasks' : 'You have no assigned tasks'}
              </Typography>
            </Box>
          )}
        </Container>
      ) : (
        <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
          <MapContainer
            center={[32.0853, 34.7818]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {filteredTasks.map((task) => (
              <Marker
                key={task.taskId}
                position={[Number(task.incident.latitude), Number(task.incident.longitude)]}
                icon={getPriorityIcon(task.incident.priorityScore)}
                eventHandlers={{
                  click: () => setSelectedTask(task),
                }}
              />
            ))}
          </MapContainer>
          {selectedTask && (
            <Box sx={{ position: 'absolute', bottom: 90, left: 16, right: 16, zIndex: 1000 }}>
              <TaskCard 
                task={selectedTask} 
                onClaim={() => mode === 'pool' ? handleClaim(selectedTask.taskId) : handleFinish(selectedTask)} 
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
