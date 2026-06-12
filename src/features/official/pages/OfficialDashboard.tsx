import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useSearchParams } from 'react-router-dom';
import { useAuthUser } from '@/features/auth/hooks/useAuth';
import { StatCard } from '../components/StatCard';
import {
  useMayorStats,
  useMayorAiInsights,
  useMayorCriticalAlerts,
} from '../api/mayorApi';
import { mapMayorMetrics, mapMayorAlerts } from '../utils/dashboardUtils';
import { CityControlMap } from '../components/CityControlMap';
import { DepartmentKpis } from '../components/DepartmentKpis';
import { PublicPulse } from '../components/PublicPulse';
import './OfficialDashboard.css';

const OfficialDashboard = () => {
  const { data: user } = useAuthUser();
  const { data: stats, isLoading: isLoadingStats } = useMayorStats();
  const { data: aiInsight, isLoading: isLoadingInsight } = useMayorAiInsights();
  const { data: alerts, isLoading: isLoadingAlerts } = useMayorCriticalAlerts();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') || 'home') as 'home' | 'map' | 'kpis' | 'pulse';

  const mayorCityName = user?.cityName || "Mayor's Office";

  // Map metrics and critical alerts dynamically using utility helper functions
  const metricsConfigs = mapMayorMetrics(stats, isLoadingStats);
  const criticalAlertsMapped = mapMayorAlerts(alerts);

  const handleDispatchTeam = () => {
    const action = aiInsight?.action_type || 'DISPATCH_TEAM';
    alert(`Triggered system action: ${action.replace('_', ' ')}!`);
  };

  const handleTabChange = (tab: 'home' | 'map' | 'kpis' | 'pulse') => {
    setSearchParams({ tab });
  };

  return (
    <Box className="official-dashboard">
      {/* 1. Header Tab Bar (Sub-navigation for Mayor's views) */}
      <Box className="dashboard-tabs-bar">
        {(['home', 'map', 'kpis', 'pulse'] as const).map((tab) => (
          <Button
            key={tab}
            className={`tab-pill-btn ${activeTab === tab ? 'tab-pill-btn--active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.toUpperCase()}
          </Button>
        ))}
      </Box>

      {/* Main View Content Switcher */}
      <Box className="official-dashboard__content">
        {activeTab === 'home' && (
          <Box className="home-view-container">
            {/* Executive Header */}
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

            {/* Home Content Layout */}
            <Box className="home-view-layout">
              {/* KPI Metrics Grid */}
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

              {/* AI Intelligence Section */}
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

              {/* Critical Alerts Section */}
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
        )}

        {activeTab === 'map' && <CityControlMap />}
        {activeTab === 'kpis' && <DepartmentKpis />}
        {activeTab === 'pulse' && <PublicPulse />}
      </Box>
    </Box>
  );
};

export default OfficialDashboard;