import { useMutation, useQuery } from "@tanstack/react-query";
import { createReport, uploadAndAnalyze, fetchMyReports } from "../features/auth/api/services/reportApi";

export const useUploadAndAnalyze = () => {
    return useMutation({
        mutationFn: (file: File) => uploadAndAnalyze(file),
    });
};

export const useMyReports = () => {
    return useQuery({
        queryKey: ['my-reports'],
        queryFn: fetchMyReports,
    });
};

export const useCreateReport = () => {
    return useMutation({
        mutationFn: (report: any) => createReport(report),
    });
};