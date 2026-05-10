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
  tealHeader: '#0f5a61',
  criticalPriority: '#D32F2F', // Deep red
  highPriority: '#FF9800',     // Orange
  normalPriority: '#4CAF50',   // Green/Blue
  successGreen: '#2ECC71',
  darkBlueFooter: '#2C4364',
};

export const API_BASE_URL = 'http://localhost:3000/api';
export const UPLOADS_BASE_URL = 'http://localhost:5000/uploads/';
