import { authApi, Paths } from '@/shared/api/axiosInstance';

export const getReportCategories = async () => {
  const { data } = await authApi.get(Paths.REPORT_CATEGORIES);
  return data.data;
};
