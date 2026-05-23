import type { MayorStatsResponse, MayorCriticalAlert } from '@/hooks/Mayor';
import type { MetricConfig } from '@/types/metricConfig';
import type { CriticalAlertConfig } from '@/types/criticalAlertsConfig';

/**
 * Maps the live backend Mayor stats payload to the MetricConfig UI structures.
 */
export const mapMayorMetrics = (
  stats: MayorStatsResponse | undefined,
  isLoadingStats: boolean
): MetricConfig[] => {
  return [
    {
      id: 'open-cases',
      title: 'OPEN CASES',
      accentColor: 'red',
      accentPosition: 'bottom',
      value: isLoadingStats || !stats ? '...' : stats.openReports.value.toString(),
      trendText: stats?.openReports.delta || '0%',
      trendDirection: stats?.openReports.delta.startsWith('+') ? 'up' : 'down',
      trendColor: stats?.openReports.delta.startsWith('+') ? 'red' : 'green', // Open cases increasing is bad (red)
    },
    {
      id: 'closed-cases',
      title: 'CLOSED CASES',
      accentColor: 'green',
      accentPosition: 'bottom',
      value: isLoadingStats || !stats ? '...' : stats.closedReports.value.toString(),
      trendText: stats?.closedReports.delta || '0%',
      trendDirection: stats?.closedReports.delta.startsWith('+') ? 'up' : 'down',
      trendColor: stats?.closedReports.delta.startsWith('+') ? 'green' : 'red', // Closed cases increasing is good (green)
    },
    {
      id: 'avg-close',
      title: 'AVG CLOSE',
      accentColor: 'green',
      accentPosition: 'bottom',
      value: isLoadingStats || !stats ? '...' : `${stats.resolutionTime.value}d`,
      trendText: stats?.resolutionTime.delta || '0d',
      trendDirection: stats?.resolutionTime.delta.startsWith('+') ? 'up' : 'down',
      trendColor: stats?.resolutionTime.delta.startsWith('+') ? 'red' : 'green', // Higher resolution time is bad (red)
    },
    {
      id: 'satisfaction',
      title: 'SATISFACTION',
      accentColor: 'teal',
      accentPosition: 'bottom',
      value: isLoadingStats || !stats ? '...' : `${stats.satisfaction.value}%`,
      trendText: stats?.satisfaction.delta || '0%',
      trendDirection: stats?.satisfaction.delta.startsWith('+') ? 'up' : 'down',
      trendColor: stats?.satisfaction.delta.startsWith('+') ? 'green' : 'red', // Higher satisfaction is good (green)
    },
  ];
};

/**
 * Maps the live backend SLA-based critical alerts payload to the CriticalAlertConfig UI structures.
 */
export const mapMayorAlerts = (
  alerts: MayorCriticalAlert[] | undefined
): CriticalAlertConfig[] => {
  return (
    alerts?.map((alert) => ({
      id: `alert-${alert.reportId}`,
      title: `${alert.category}: ${alert.description.replace('Citizen reported: ', '')}`,
      subtitle: alert.exceededSla
        ? `Exceeded SLA by ${Math.round(alert.ageDays - alert.slaDays)} days`
        : `Age: ${alert.ageDays} days (SLA: ${alert.slaDays}d)`,
      accentColor: alert.exceededSla ? 'red' : 'orange',
    })) || []
  );
};
