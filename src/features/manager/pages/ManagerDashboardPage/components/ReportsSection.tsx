import { Box, Typography, Button, Chip, IconButton, useTheme, useMediaQuery, darken } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import type { Report } from '@/types/models';

interface Props {
  reports: Report[];
  selectedReportIds: number[];
  onToggleReport: (id: number) => void;
  onSelectAll: () => void;
  onOpenCreateIncident: () => void;
}

export function ReportsSection({ reports, selectedReportIds, onToggleReport, onSelectAll, onOpenCreateIncident }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const allSelected = reports.length > 0 && selectedReportIds.length === reports.length;
  const someSelected = selectedReportIds.length > 0 && !allSelected;

  return (
    <Box className="mgr-section">
      <Box className="mgr-section__title-row">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReportProblemOutlinedIcon sx={{ color: 'secondary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Open Reports</Typography>
          <Chip label={reports.length} size="small" sx={{ bgcolor: 'secondary.main', color: '#fff', fontWeight: 700 }} />
        </Box>
        <Button
          variant="contained"
          size={isMobile ? 'small' : 'medium'}
          disabled={selectedReportIds.length === 0}
          onClick={onOpenCreateIncident}
          sx={{
            bgcolor: 'primary.main', color: '#fff', borderRadius: '0.75rem', fontWeight: 700,
            '&:hover': { bgcolor: (t) => darken(t.palette.primary.main, 0.2) },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
          }}
        >
          {isMobile ? 'New Incident' : `Create Incident (${selectedReportIds.length} selected)`}
        </Button>
      </Box>

      {reports.length > 0 && (
        <Box className="mgr-select-all" onClick={onSelectAll}>
          <IconButton size="small" sx={{ color: someSelected || allSelected ? 'primary.main' : 'text.disabled' }}>
            {allSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {allSelected ? 'Deselect all' : 'Select all'}
          </Typography>
        </Box>
      )}

      <Box className="mgr-report-list">
        {reports.length === 0 && (
          <Typography sx={{ color: 'text.secondary', py: 3, textAlign: 'center' }}>
            No open unassigned reports.
          </Typography>
        )}
        {reports.map(r => {
          const selected = selectedReportIds.includes(r.reportId);
          return (
            <Box
              key={r.reportId}
              className={`mgr-report-card${selected ? ' mgr-report-card--selected' : ''}`}
              onClick={() => onToggleReport(r.reportId)}
            >
              <IconButton size="small" sx={{ color: selected ? 'primary.main' : 'text.disabled', flexShrink: 0 }}>
                {selected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
              </IconButton>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.25 }}>
                  <Chip label={r.category?.name} size="small" sx={{ bgcolor: 'surface.main', fontWeight: 600, fontSize: '0.72rem' }} />
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    #{r.reportId} · {new Date(r.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.primary', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {r.description}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {r.requester?.firstName} {r.requester?.lastName}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
