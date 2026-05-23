import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAuthUser } from '@/hooks/Auth';
import { StatCard } from './components/StatCard';
import {
  useMayorStats,
  useMayorAiInsights,
  useMayorCriticalAlerts,
} from '@/hooks/Mayor';
import type { MetricConfig } from '@/types/metricConfig';
import type { CriticalAlertConfig } from '@/types/criticalAlertsConfig';
import './OfficialDashboard.css';

const OfficialDashboard = () => {
  const { data: user } = useAuthUser();
  const { data: stats, isLoading: isLoadingStats } = useMayorStats();
  const { data: aiInsight, isLoading: isLoadingInsight } = useMayorAiInsights();
  const { data: alerts, isLoading: isLoadingAlerts } = useMayorCriticalAlerts();

  const mayorCityName = user?.cityName || "Mayor's Office";

  // Map backend metrics dynamically to our UI configurations
  const metricsConfigs: MetricConfig[] = [
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

  // Map the SLA-based critical alerts array to UI config
  const criticalAlertsMapped: CriticalAlertConfig[] = alerts?.map(alert => {
    return {
      id: `alert-${alert.reportId}`,
      title: `${alert.category}: ${alert.description.replace('Citizen reported: ', '')}`,
      subtitle: alert.exceededSla 
        ? `Exceeded SLA by ${Math.round(alert.ageDays - alert.slaDays)} days` 
        : `Age: ${alert.ageDays} days (SLA: ${alert.slaDays}d)`,
      accentColor: alert.exceededSla ? 'red' : 'orange',
    };
  }) || [];

  const handleDispatchTeam = () => {
    const action = aiInsight?.action_type || 'DISPATCH_TEAM';
    alert(`Triggered system action: ${action.replace('_', ' ')}!`);
  };

  return (
    <Box className="official-dashboard">
      {/* 1. Executive Header */}
      <Box className="executive-header">
        <Box className="executive-header__info">
          <Typography variant="h5" className="executive-header__title">
            Executive Hub
          </Typography>
          <Typography variant="caption" className="executive-header__subtitle">
            {mayorCityName.toUpperCase()}
          </Typography>
        </Box>
        <IconButton className="notification-bell-btn">
          <NotificationsIcon />
          <Box className="notification-dot" />
        </IconButton>
      </Box>

      {/* Main Responsive Grid Layout Content */}
      <Box className="official-dashboard__content">
        {/* 2. KPI Metrics Grid Row */}
        <Box className="kpi-grid">
          {metricsConfigs.map((metric) => (
            <StatCard
              key={metric.id}
              title={metric.title}
              accentColor={metric.accentColor}
              accentPosition={metric.accentPosition}
            >
              {isLoadingStats ? (
                <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '3rem', py: 0.5 }}>
                  <CircularProgress size={24} color="primary" />
                </Box>
              ) : (
                <Typography variant="h4" className="kpi-value">
                  {metric.value}
                </Typography>
              )}

              <Box
                className={`kpi-trend ${metric.trendColor === 'red' ? 'kpi-trend--red' : 'kpi-trend--green'}`}
              >
                {metric.trendDirection === 'up' ? (
                  <ArrowUpwardIcon sx={{ fontSize: '1rem' }} />
                ) : (
                  <ArrowDownwardIcon sx={{ fontSize: '1rem' }} />
                )}
                <span>{metric.trendText}</span>
              </Box>
            </StatCard>
          ))}
        </Box>

        {/* 3. AI Intelligence Section (Gemini Insights Card) */}
        <Box className="ai-intelligence-card">
          <Box className="ai-intelligence-header">
            <SmartToyIcon sx={{ fontSize: '1.25rem' }} />
            <span>AI Intelligence</span>
          </Box>
          {isLoadingInsight ? (
            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '3.5rem', py: 1 }}>
              <CircularProgress size={24} color="inherit" />
            </Box>
          ) : (
            <Typography variant="h6" className="ai-intelligence-text">
              {aiInsight?.insight ? `"${aiInsight.insight}"` : '"No critical issues or geographic clusters detected."'}
            </Typography>
          )}
          <Button
            variant="contained"
            className="dispatch-btn"
            onClick={handleDispatchTeam}
            fullWidth
            disabled={isLoadingInsight || !aiInsight || aiInsight.action_type === 'MONITOR'}
          >
            {aiInsight?.action_type 
              ? aiInsight.action_type.replace('_', ' ') 
              : 'Dispatch Team'}
          </Button>
        </Box>

        {/* 4. Critical SLA-Based Alerts Section */}
        <Box className="critical-alerts-section">
          <Typography variant="caption" className="section-title">
            Critical Alerts
          </Typography>
          <Box className="alerts-list">
            {isLoadingAlerts ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} />
              </Box>
            ) : criticalAlertsMapped.length === 0 ? (
              <StatCard title="" accentColor="teal" accentPosition="left">
                <Box className="alert-item-layout" sx={{ py: 1, justifyContent: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center' }}>
                    🎉 No critical alerts. All reports are within SLA targets!
                  </Typography>
                </Box>
              </StatCard>
            ) : (
              criticalAlertsMapped.map((alertItem) => (
                <StatCard
                  key={alertItem.id}
                  title=""
                  accentColor={alertItem.accentColor}
                  accentPosition="left"
                >
                  <Box className="alert-item-layout">
                    <Box 
                      className="alert-icon-box"
                      sx={{
                        backgroundColor: alertItem.accentColor === 'red' ? '#fee2e2' : '#ffedd5',
                        color: alertItem.accentColor === 'red' ? '#ef4444' : '#f97316',
                      }}
                    >
                      <WarningAmberIcon sx={{ fontSize: '1.5rem' }} />
                    </Box>
                    <Box className="alert-text-box">
                      <Typography variant="body1" className="alert-title">
                        {alertItem.title}
                      </Typography>
                      <Typography variant="caption" className="alert-subtitle">
                        {alertItem.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </StatCard>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OfficialDashboard;