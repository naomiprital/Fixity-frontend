import { api } from '@/shared/api/axiosInstance';

const REPORTS_ROUTE = 'reports';

export const uploadAndAnalyze = async (file: File): Promise<{ imageUrl: string; aiDraft: any }> => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post(`${REPORTS_ROUTE}/upload-analyze`, formData);
  return data;
};

export const createReport = async (report: any) => {
  const { data } = await api.post(REPORTS_ROUTE, report);
  return data.data;
};

export const fetchMyReports = async (): Promise<any[]> => {
  const { data } = await api.get(`${REPORTS_ROUTE}/me`);
  return data;
};

export const supportReport = async (reportId: number) => {
  const { data } = await api.post(`${REPORTS_ROUTE}/${reportId}/support`);
  return data;
};

export const fetchAllReports = async (): Promise<any[]> => {
  const { data } = await api.get(REPORTS_ROUTE);
  return data;
};
