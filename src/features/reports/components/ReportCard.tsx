import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { format } from 'date-fns';
import { supportReport } from '../api/reportApi';
import { toast } from 'react-toastify';
import type { Report } from '@/types/models';
import { useAuthUser } from '@/features/auth/hooks/useAuth';
import { ReportDetailsModal } from './ReportDetailsModal';

interface ReportCardProps {
  report: Report;
  isOwner?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, isOwner }) => {
  const { data: currentUser } = useAuthUser();
  const [supportCount, setSupportCount] = useState(report.supportCount || 0);
  const [isSupported, setIsSupported] = useState(
    !!report.supports?.some(s => s.userId === currentUser?.userId)
  );
  const [isSupporting, setIsSupporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsModalOpen(false);
  };

  useEffect(() => {
    setSupportCount(report.supportCount || 0);
    setIsSupported(!!report.supports?.some(s => s.userId === currentUser?.userId));
  }, [report.supportCount, report.supports, currentUser?.userId]);

  const isMyReport = currentUser?.userId === report.requesterId;

  const handleSupport = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMyReport) {
      toast.info("You cannot support your own report.");
      return;
    }
    if (isSupporting) return;

    setIsSupporting(true);
    try {
      const res = await supportReport(report.reportId);
      setSupportCount(res.supportCount);
      setIsSupported(res.supported);
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update support.');
    } finally {
      setIsSupporting(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'InProgress': return 'status-inprogress';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Open': return 'Received';
      case 'InProgress': return 'In Progress';
      case 'Closed': return 'Completed';
      default: return status;
    }
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case 'Open': return '15%';
      case 'InProgress': return '60%';
      case 'Closed': return '100%';
      default: return '0%';
    }
  };

  const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000/api';
  const IMAGE_BASE = API_BASE.replace('/api', '');

  return (
    <>
      <Box className="report-card" onClick={handleCardClick} sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' } }}>
        <img
          src={report.beforeImageUrl ? `${IMAGE_BASE}${report.beforeImageUrl}` : 'https://placehold.co/80'}
          alt={report.description}
          className="report-image"
          crossOrigin="anonymous"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== 'https://placehold.co/80') {
              target.src = 'https://placehold.co/80';
            }
          }}
        />
        <Box className="report-details">
          <Box className="report-title-row">
            <Typography className="report-title">{report.category?.name || 'General'}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isMyReport && !isOwner ? (
                <Box sx={{
                  bgcolor: (theme) => alpha(theme.palette.primary.dark, 0.1),
                  color: 'primary.dark',
                  px: 1,
                  py: 0.25,
                  borderRadius: '0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  border: (theme) => `1px solid ${alpha(theme.palette.primary.dark, 0.2)}`
                }}>
                  My Report
                </Box>
              ) : !isOwner && (
                <Box sx={{ display: 'flex', alignItems: 'center', color: isSupported ? 'info.main' : 'text.disabled' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mr: 0.5 }}>
                    {supportCount}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleSupport}
                    disabled={isSupporting}
                    sx={{
                      p: 0.5,
                      color: isSupported ? 'info.main' : 'inherit',
                      '&.Mui-disabled': { color: isSupported ? 'info.main' : 'action.disabledBackground' }
                    }}
                  >
                    {isSupporting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : isSupported ? (
                      <ThumbUpIcon fontSize="small" />
                    ) : (
                      <ThumbUpOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              )}
              {isOwner && report.status === 'Open' && (
                <IconButton
                  size="small"
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info("Delete functionality coming soon!");
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
          <Box>
            <span className={`status-chip ${getStatusClass(report.status)}`}>
              {getStatusLabel(report.status)}
            </span>
          </Box>

          {report.status === 'InProgress' && (
            <Box className="progress-bar-container">
              <Box
                className="progress-bar"
                style={{ width: getProgressWidth(report.status) }}
              />
            </Box>
          )}

          <Box className="report-footer">
            <Typography className="report-meta">
              {report.status === 'Open'
                ? `Opened: ${format(new Date(report.createdAt), 'MMM d, HH:mm')}`
                : report.status === 'InProgress'
                  ? 'City worker is handling this'
                  : `Closed: ${format(new Date(report.createdAt), 'MMM d, HH:mm')}`}
            </Typography>
            <Typography className="report-id">#TR-{report.reportId}</Typography>
          </Box>
        </Box>
      </Box>

      <ReportDetailsModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        report={report} 
        isOwner={isOwner} 
      />
    </>
  );
};
