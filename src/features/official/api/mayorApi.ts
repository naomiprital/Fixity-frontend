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

export interface MayorDepartmentSla {
  department: string;
  sla: number;
  resolved: number;
  pending: number;
  status: 'on_track' | 'needs_attention';
}

export interface MayorDepartmentsResponse {
  slaData: MayorDepartmentSla[];
  chartData: Array<{ department: string; efficiency: number; budget: number }>;
}

export interface MayorPulseResponse {
  happinessScore: number;
  happinessDelta: string;
  trendingTopics: Array<{ tag: string; color: string }>;
  positiveCount: number;
  negativeCount: number;
  summary: string;
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

export const useMayorMapDensity = (category?: string) => {
  return useQuery<MayorMapDensity[]>({
    queryKey: ['mayor-map-density', category],
    queryFn: async () => {
      const { data } = await authApi.get('/mayor/map-density', {
        params: category && category !== 'All Faults' ? { category } : undefined,
      });
      return data;
    },
  });
};

export const useMayorDepartments = () => {
  return useQuery<MayorDepartmentsResponse>({
    queryKey: ['mayor-departments'],
    queryFn: async () => {
      const { data } = await authApi.get('/mayor/departments');
      return data;
    },
  });
};

export const useMayorPulse = () => {
  return useQuery<MayorPulseResponse>({
    queryKey: ['mayor-pulse'],
    queryFn: async () => {
      const { data } = await authApi.get('/mayor/pulse');
      return data;
    },
    staleTime: 30000,
  });
};

export interface MayorRecommendation {
  title: string;
  description: string;
  category: 'Infrastructure' | 'Service Delivery' | 'Public Safety' | 'Citizen Engagement' | 'Environment';
  impact: 'High' | 'Medium' | 'Low';
}

export const useMayorRecommendations = () => {
  return useQuery<MayorRecommendation[]>({
    queryKey: ['mayor-recommendations'],
    queryFn: async () => {
      const { data } = await authApi.get('/mayor/recommendations');
      return data;
    },
    staleTime: 120000, // Cache for 2 minutes
  });
};
