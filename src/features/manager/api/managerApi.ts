import type { Report, Task, Incident, TaskCategory } from '@/types/models';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

function getAuthHeaders(): Record<string, string> {
  const authDataString = localStorage.getItem('fixity.auth');
  if (authDataString) {
    try {
      const authData = JSON.parse(authDataString);
      return { Authorization: `Bearer ${authData.token}` };
    } catch (e) { }
  }
  return {};
}

export async function fetchManagerReports(): Promise<Report[]> {
  const res = await fetch(`${API_BASE_URL}/reports`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch reports');
  const reports: Report[] = await res.json();
  return reports.filter(r => r.status === 'Open' && r.incidentId === null);
}

export async function fetchIncidents(): Promise<Incident[]> {
  const res = await fetch(`${API_BASE_URL}/incidents`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function createIncident(payload: { reportIds: number[]; description?: string }): Promise<Incident> {
  const res = await fetch(`${API_BASE_URL}/incidents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create incident');
  const data = await res.json();
  return data.incident;
}

export async function createTask(payload: { incidentId: number; categoryId: number; workerNotes?: string }): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create task');
  const data = await res.json();
  return data.task;
}

export async function fetchTaskCategories(): Promise<TaskCategory[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch task categories');
  return res.json();
}

export async function updateIncident(id: number, payload: { description?: string }): Promise<Incident> {
  const res = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update incident');
  const data = await res.json();
  return data.incident;
}

export async function deleteIncident(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/incidents/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete incident');
}

export async function updateTask(id: number, payload: { workerNotes?: string; categoryId?: number }): Promise<Task> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update task');
  const data = await res.json();
  return data.task;
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete task');
}
