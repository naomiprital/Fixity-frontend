import { api } from './axiosInstance';

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
