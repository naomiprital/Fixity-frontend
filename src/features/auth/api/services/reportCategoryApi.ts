import { api } from './axiosInstance';

const REPORT_CATEGORIES_ROUTE = 'report-categories';

export const getReportCategories = async () => {
  const { data } = await api.get(REPORT_CATEGORIES_ROUTE);
  return data.data;
};
