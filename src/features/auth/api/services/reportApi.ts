import { api } from './axiosInstance';

const REPORTS_ROUTE = 'reports';

export const createReport = async (report: any) => {
  const { data } = await api.post(REPORTS_ROUTE, report);
  return data.data;
};
