export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  taskId: number;
  incidentId: number;
  status: string;
  workerNotes?: string;
  afterImageUrl?: string;
  incident: {
    incidentId: number;
    description: string;
    latitude: string;
    longitude: string;
    priorityScore: string | number;
    createdAt: string;
  };
  category: {
    name: string;
    description: string;
  };
}

export const WORKER_COLORS = {
  tealHeader: '#135D66',
  highPriority: '#FF5252',
  mediumPriority: '#F39C12', // Slightly deeper orange
  lowPriority: '#3498DB',    // Vibrant blue instead of gray
  successGreen: '#2ECC71',
  darkBlueFooter: '#2C4364',
};

export const API_BASE_URL = 'http://localhost:3000/api';
export const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/';
