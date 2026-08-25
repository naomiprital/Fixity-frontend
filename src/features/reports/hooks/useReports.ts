import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReport, uploadAndAnalyze, fetchMyReports, fetchActiveReports, deleteReport } from "../api/reportApi";

export const useActiveReports = () => {
    return useQuery({
        queryKey: ['active-reports'],
        queryFn: fetchActiveReports,
    });
};

export const useUploadAndAnalyze = () => {
    return useMutation({
        mutationFn: ({ file, analyzeOnly, skipAi }: { file: File; analyzeOnly?: boolean; skipAi?: boolean }) => uploadAndAnalyze(file, analyzeOnly, skipAi),
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

export const useDeleteReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reportId: number) => deleteReport(reportId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-reports'] });
            queryClient.invalidateQueries({ queryKey: ['active-reports'] });
        }
    });
};