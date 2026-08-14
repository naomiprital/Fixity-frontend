import type { Report, Task, Incident, TaskCategory } from '@/types/models';
import { authApi, Paths } from '@/shared/api/axiosInstance';

export async function fetchManagerReports(): Promise<Report[]> {
  const { data } = await authApi.get<Report[]>(Paths.REPORTS);
  return data.filter((r) => r.status === 'Open' && r.incidentId === null);
}

export async function fetchIncidents(): Promise<Incident[]> {
  const { data } = await authApi.get<Incident[]>(Paths.INCIDENTS);
  return data;
}

export async function createIncident(payload: {
  reportIds: number[];
  description?: string;
}): Promise<Incident> {
  const { data } = await authApi.post(Paths.INCIDENTS, payload);
  return data.incident;
}

export async function createTask(payload: {
  incidentId: number;
  categoryId: number;
  workerNotes?: string;
}): Promise<Task> {
  const { data } = await authApi.post(Paths.TASKS, payload);
  return data.task;
}

export async function fetchTaskCategories(): Promise<TaskCategory[]> {
  const { data } = await authApi.get<TaskCategory[]>(Paths.CATEGORIES);
  return data;
}

export async function updateIncident(
  id: number,
  payload: { description?: string }
): Promise<Incident> {
  const { data } = await authApi.patch(`${Paths.INCIDENTS}/${id}`, payload);
  return data.incident;
}

export async function deleteIncident(id: number): Promise<void> {
  await authApi.delete(`${Paths.INCIDENTS}/${id}`);
}

export async function closeIncident(id: number): Promise<Incident> {
  const { data } = await authApi.post(`${Paths.INCIDENTS}/${id}/close`);
  return data.incident;
}

export async function updateTask(
  id: number,
  payload: { workerNotes?: string; categoryId?: number }
): Promise<Task> {
  const { data } = await authApi.patch(`${Paths.TASKS}/${id}`, payload);
  return data.task;
}

export async function deleteTask(id: number): Promise<void> {
  await authApi.delete(`${Paths.TASKS}/${id}`);
}

export async function addReportsToIncident(incidentId: number, reportIds: number[]): Promise<void> {
  await authApi.post(`${Paths.INCIDENTS}/${incidentId}/reports`, { reportIds });
}

export async function removeReportFromIncident(
  incidentId: number,
  reportId: number
): Promise<void> {
  await authApi.delete(`${Paths.INCIDENTS}/${incidentId}/reports/${reportId}`);
}
