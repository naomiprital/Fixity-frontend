import { useQuery } from "@tanstack/react-query";
import { getReportCategories } from "../api/reportCategoryApi";

export const useReportCategories = () => {
    return useQuery({
        queryKey: ['report-categories'],
        queryFn: getReportCategories,
    });
};
