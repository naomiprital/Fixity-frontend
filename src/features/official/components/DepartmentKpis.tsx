import { Box, Typography, CircularProgress, Tooltip } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useMayorDepartments } from '../api/mayorApi';
import './DepartmentKpis.css';

export const DepartmentKpis = () => {
  const { data: deptData, isLoading } = useMayorDepartments();

  if (isLoading || !deptData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, width: '100%' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  const { slaData, chartData } = deptData;

  const getSlaStyles = (val: number) => {
    if (val >= 85) return { color: '#10b981', bg: '#d1fae5', text: 'on-track' };
    if (val >= 70) return { color: '#f59e0b', bg: '#fef3c7', text: 'warning' };
    return { color: '#ef4444', bg: '#fee2e2', text: 'critical' };
  };

  return (
    <Box className="department-kpis">
      <Box className="dept-header">
        <Box className="dept-header__info">
          <Typography variant="h5" className="dept-title">
            Departments
          </Typography>
          <Typography variant="caption" className="dept-subtitle">
            SLA TRACKING
          </Typography>
        </Box>
      </Box>

      <Box className="sla-cards-list">
        {slaData.map((item) => {
          const styles = getSlaStyles(item.sla);
          const isLowSla = item.sla < 75;

          return (
            <Box key={item.department} className="sla-card">
              <Box className="sla-card__row">
                <Typography className="sla-card__name">{item.department}</Typography>
                <Typography className="sla-card__percentage" style={{ color: styles.color }}>
                  {item.sla}%
                </Typography>
              </Box>

              <Box className="sla-card__progress-container">
                <Box
                  className="sla-card__progress-bar"
                  style={{
                    width: `${item.sla}%`,
                    backgroundColor: styles.color,
                  }}
                />
              </Box>

              <Box className="sla-card__row sla-card__footer">
                <Typography className="sla-card__resolved">
                  {item.resolved} RESOLVED
                </Typography>

                {isLowSla ? (
                  <Box className="sla-card__bottleneck-btn">
                    <WarningIcon sx={{ fontSize: '0.875rem', mr: '0.25rem', color: '#ef4444' }} />
                    <span style={{ color: '#ef4444', fontWeight: 800 }}>OVERLOADED</span>
                  </Box>
                ) : (
                  <Typography className="sla-card__pending">
                    {item.pending} PENDING
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box className="budget-chart-container">
        <Typography variant="caption" className="budget-chart-title">
          RESPONSE EFFICIENCY VS BUDGET
        </Typography>

        <Box className="bar-chart-canvas">
          {chartData.map((data) => {
            const relatedSla = slaData.find((s) => s.department === data.department)?.sla || data.efficiency;
            const slaStyles = getSlaStyles(relatedSla);

            return (
              <Box key={data.department} className="bar-group-item">
                <Box className="bars-container">
                  <Tooltip title={`Efficiency: ${data.efficiency}%`} arrow>
                    <Box
                      className="bar bar--efficiency"
                      style={{
                        height: `${data.efficiency}%`,
                        backgroundImage: `linear-gradient(to top, ${slaStyles.color}CC, ${slaStyles.color})`,
                        boxShadow: `0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)`,
                      }}
                    >
                      <span className="bar-label-inner">{data.efficiency}%</span>
                    </Box>
                  </Tooltip>

                  <Tooltip title={`Budget Utilization: ${data.budget}%`} arrow>
                    <Box
                      className="bar bar--budget"
                      style={{
                        height: `${data.budget}%`,
                      }}
                    >
                      <span className="bar-label-inner">{data.budget}%</span>
                    </Box>
                  </Tooltip>
                </Box>
                <Typography className="bar-group-label">
                  {data.department.split(' ')[0]}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box className="chart-legend-row">
          <Box className="chart-legend-indicator">
            <Box className="legend-indicator-box legend-indicator-box--efficiency" />
            <span>Efficiency</span>
          </Box>
          <Box className="chart-legend-indicator">
            <Box className="legend-indicator-box legend-indicator-box--budget" />
            <span>Budget Target</span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
