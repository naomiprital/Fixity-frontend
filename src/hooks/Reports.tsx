import { useMutation } from "@tanstack/react-query";
import { createReport, uploadAndAnalyze } from "../features/auth/api/services/reportApi";

export const useUploadAndAnalyze = () => {
    return useMutation({
        mutationFn: (file: File) => uploadAndAnalyze(file),
    });
};

export const useCreateReport = () => {
    return useMutation({
        mutationFn: (report: any) => createReport(report),
    });
};