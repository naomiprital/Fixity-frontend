import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/shared/api/axiosInstance';

export interface MayorStatsResponse {
  openReports: { value: number; delta: string };
  closedReports: { value: number; delta: string };
  resolutionTime: { value: number; delta: string };
  satisfaction: { value: number; delta: string };
}

export interface MayorAiInsightResponse {
  insight: string;
  action_type: string;
}

export interface MayorCriticalAlert {
  reportId: number;
  description: string;
  createdAt: string;
  status: string;
  supportCount: number;
  category: string;
  severity: number | null;
  slaDays: number;
  ageDays: number;
  isUrgent: boolean;
  exceededSla: boolean;
  requesterName: string;
}

export interface MayorMapDensity {
  lat: number;
  lng: number;
  density: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const useMayorStats = () => {
  return useQuery<MayorStatsResponse>({
    queryKey: ['mayor-stats'],
    queryFn: async () => {
      const { data } = await authApi.get('/mayor/stats');
      return data;
    },
  });
};

export const useMayorAiInsights = () => {
  return useQuery<MayorAiInsightResponse>({
    queryKey: ['mayor-ai-insights'],
    queryFn: async () => {
      const { data } = await authApi.get('/mayor/ai-insights');
      return data;
    },
    staleTime: 60000, // 1 minute stale time for AI insights
  });
};

export const useMayorCriticalAlerts = () => {
  return useQuery<MayorCriticalAlert[]>({
    queryKey: ['mayor-critical-alerts'],
    queryFn: async () => {
      const { data } = await authApi.get('/mayor/critical-alerts');
      return data;
    },
  });
};

export const useMayorMapDensity = () => {
  return useQuery<MayorMapDensity[]>({
    queryKey: ['mayor-map-density'],
    queryFn: async () => {
      const { data } = await authApi.get('/mayor/map-density');
      return data;
    },
  });
};
