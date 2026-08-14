import { useMutation, useQuery } from "@tanstack/react-query";
import { createReport, uploadAndAnalyze, fetchMyReports, fetchAllReports } from "../api/reportApi";

export const useAllReports = () => {
    return useQuery({
        queryKey: ['all-reports'],
        queryFn: fetchAllReports,
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