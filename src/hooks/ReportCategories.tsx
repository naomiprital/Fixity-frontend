import { useQuery } from "@tanstack/react-query";
import { getReportCategories } from "../features/auth/api/services/reportCategoryApi";

export const useReportCategories = () => {
    return useQuery({
        queryKey: ['report-categories'],
        queryFn: getReportCategories,
    });
};
