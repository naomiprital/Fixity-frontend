import { authApi, Paths } from '@/shared/api/axiosInstance';

export const uploadAndAnalyze = async (file: File): Promise<{ imageUrl: string; aiDraft: any }> => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await authApi.post(`${Paths.REPORTS}/upload-analyze`, formData);
  return data;
};

export const createReport = async (report: any) => {
  const { data } = await authApi.post(Paths.REPORTS, report);
  return data.data;
};

export const fetchMyReports = async (): Promise<any[]> => {
  const { data } = await authApi.get(`${Paths.REPORTS}/me`);
  return data;
};

export const supportReport = async (reportId: number) => {
  const { data } = await authApi.post(`${Paths.REPORTS}/${reportId}/support`);
  return data;
};

export const fetchAllReports = async (): Promise<any[]> => {
  const { data } = await authApi.get(Paths.REPORTS);
  return data;
};
