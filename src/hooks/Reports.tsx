import { useMutation } from "@tanstack/react-query";
import { createReport } from "../features/auth/api/services/reportApi";

export const useCreateReport = () => {
    return useMutation({
        mutationFn: (report: any) => createReport(report),
    });
};