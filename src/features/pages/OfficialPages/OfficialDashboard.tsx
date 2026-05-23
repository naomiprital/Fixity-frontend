import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAuthUser } from '@/hooks/Auth';
import { useAllReports } from '@/hooks/Reports';
import { StatCard } from './components/StatCard';
import { calculateDashboardMetrics } from '@/utils/dashboardUtils';
import './OfficialDashboard.css';

interface CriticalAlertConfig {
  id: string;
  title: string;
  subtitle: string;
  accentColor: 'red' | 'green' | 'orange' | 'teal';
}

const OfficialDashboard = () => {
  const { data: user } = useAuthUser();
  const { data: reports, isLoading: isLoadingReports } = useAllReports();

  // Retrieve and filter reports specifically for the Mayor's / Official's city
  const mayorCityId = user?.cityId;
  const mayorCityName = user?.cityName || "Mayor's Office";

  const cityReports = reports && mayorCityId
    ? reports.filter((report) => report.cityId === mayorCityId)
    : [];

  // Calculate dynamic dashboard stats using modular helper utility
  const { metrics: metricsConfigs } = calculateDashboardMetrics(cityReports, isLoadingReports);

  // Extensible Critical Alerts Array configuration
  const criticalAlerts: CriticalAlertConfig[] = [
    {
      id: 'alert-sewage',
      title: 'Sewage Leak: North Park',
      subtitle: 'Overdue by 4 hours',
      accentColor: 'orange',
    },
  ];

  const handleDispatchTeam = () => {
    // Interactive dispatch mockup feedback
    alert('Dispatch team triggered for Marina lighting fault!');
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
              {/* Dynamic slot-like injection of stats metrics content */}
              {isLoadingReports && (metric.id === 'open-cases' || metric.id === 'closed-cases' || metric.id === 'avg-close') ? (
                <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '3rem' }}>
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

        {/* 3. AI Intelligence Section (Mockup Gradient Card) */}
        <Box className="ai-intelligence-card">
          <Box className="ai-intelligence-header">
            <SmartToyIcon sx={{ fontSize: '1.25rem' }} />
            <span>AI Intelligence</span>
          </Box>
          <Typography variant="h6" className="ai-intelligence-text">
            "Critical spike in <span className="ai-highlight">lighting faults</span> at the Marina area."
          </Typography>
          <Button
            variant="contained"
            className="dispatch-btn"
            onClick={handleDispatchTeam}
            fullWidth
          >
            Dispatch Team
          </Button>
        </Box>

        {/* 4. Critical Alerts Section */}
        <Box className="critical-alerts-section">
          <Typography variant="caption" className="section-title">
            Critical Alerts
          </Typography>
          <Box className="alerts-list">
            {criticalAlerts.map((alertItem) => (
              <StatCard
                key={alertItem.id}
                title=""
                accentColor={alertItem.accentColor}
                accentPosition="left"
              >
                {/* Dynamic alert item layout content injection */}
                <Box className="alert-item-layout">
                  <Box className="alert-icon-box">
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
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OfficialDashboard;