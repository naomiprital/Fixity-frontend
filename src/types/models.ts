export type Report = {
  reportId: number;
  categoryId: number;
  cityId: number;
  description: string;
  status: 'Open' | 'InProgress' | 'Closed';
  latitude: number;
  longitude: number;
  beforeImageUrl?: string;
  incidentId?: number | null;
  createdAt: string;
  category: { name: string };
  requesterId: number;
  requester: { userId: number; firstName: string; lastName: string; cityId: number };
  supportCount: number;
  supports?: { userId: number }[];
};

export type Task = {
  taskId: number;
  incidentId: number;
  categoryId: number;
  assignedWorkerId: number | null;
  status: 'Open' | 'InProgress' | 'Closed';
  workerNotes?: string;
  afterImageUrl?: string;
  createdAt: string;
  assignedWorker?: { firstName: string; lastName: string } | null;
  category: { name: string };
};

export type Incident = {
  incidentId: number;
  cityId: number;
  description: string;
  latitude: number;
  longitude: number;
  priorityScore: number;
  createdAt: string;
  reports: Report[];
  tasks: Task[];
};

export type TaskCategory = {
  categoryId: number;
  name: string;
};

export type City = {
  cityId: number;
  name: string;
};

