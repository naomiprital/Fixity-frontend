import type { Report, Task, Incident, TaskCategory } from '@/types/models';
import { api } from '@/shared/api/axiosInstance';

export async function fetchManagerReports(): Promise<Report[]> {
  const { data } = await api.get<Report[]>('/reports');
  return data.filter((r) => r.status === 'Open' && r.incidentId === null);
}

export async function fetchIncidents(): Promise<Incident[]> {
  const { data } = await api.get<Incident[]>('/incidents');
  return data;
}

export async function createIncident(payload: {
  reportIds: number[];
  description?: string;
}): Promise<Incident> {
  const { data } = await api.post('/incidents', payload);
  return data.incident;
}

export async function createTask(payload: {
  incidentId: number;
  categoryId: number;
  workerNotes?: string;
}): Promise<Task> {
  const { data } = await api.post('/tasks', payload);
  return data.task;
}

export async function fetchTaskCategories(): Promise<TaskCategory[]> {
  const { data } = await api.get<TaskCategory[]>('/categories');
  return data;
}

export async function updateIncident(
  id: number,
  payload: { description?: string }
): Promise<Incident> {
  const { data } = await api.patch(`/incidents/${id}`, payload);
  return data.incident;
}

export async function deleteIncident(id: number): Promise<void> {
  await api.delete(`/incidents/${id}`);
}

export async function updateTask(
  id: number,
  payload: { workerNotes?: string; categoryId?: number }
): Promise<Task> {
  const { data } = await api.patch(`/tasks/${id}`, payload);
  return data.task;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function addReportsToIncident(incidentId: number, reportIds: number[]): Promise<void> {
  await api.post(`/incidents/${incidentId}/reports`, { reportIds });
}

export async function removeReportFromIncident(
  incidentId: number,
  reportId: number
): Promise<void> {
  await api.delete(`/incidents/${incidentId}/reports/${reportId}`);
}
