import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { format } from 'date-fns';
import { supportReport } from '../api/reportApi';
import { toast } from 'react-toastify';
import type { Report } from '@/types/models';
import { useAuthUser } from '@/features/auth/hooks/useAuth';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { createPinIcon } from '@/utils/mapUtils';
import { theme } from '@/app/styles/theme';

const customMarkerIcon = createPinIcon(theme.palette.pin.main);

interface ReportDetailsModalProps {
  open: boolean;
  onClose: (e?: React.MouseEvent) => void;
  report: Report;
  isOwner?: boolean;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ open, onClose, report, isOwner }) => {
  const { data: currentUser } = useAuthUser();
  const [supportCount, setSupportCount] = useState(report?.supportCount || 0);
  const [isSupported, setIsSupported] = useState(
    !!report?.supports?.some(s => s.userId === currentUser?.userId)
  );
  const [isSupporting, setIsSupporting] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  useEffect(() => {
    if (open && !address && report?.latitude && report?.longitude) {
      const fetchAddress = async () => {
        setIsAddressLoading(true);
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${report.latitude}&lon=${report.longitude}`);
          if (res.data && res.data.display_name) {
            const parts = res.data.display_name.split(', ');
            setAddress(parts.slice(0, 3).join(', '));
          } else {
            setAddress('Address not found');
          }
        } catch (error) {
          setAddress('Unable to load address');
        } finally {
          setIsAddressLoading(false);
        }
      };
      fetchAddress();
    }
  }, [open, address, report?.latitude, report?.longitude]);

  useEffect(() => {
    if (report) {
      setSupportCount(report.supportCount || 0);
      setIsSupported(!!report.supports?.some(s => s.userId === currentUser?.userId));
      setAddress(''); // Reset address when report changes
    }
  }, [report, currentUser?.userId]);

  if (!report) return null;

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

  const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000/api';
  const IMAGE_BASE = API_BASE.replace('/api', '');

  return (
    <Dialog open={open} onClose={(e: any) => onClose(e)} maxWidth="sm" fullWidth onClick={(e) => e.stopPropagation()}>
      <DialogTitle sx={{ m: 0, p: 2, pr: 6, fontWeight: 700, fontFamily: 'Sora, sans-serif', color: 'primary.dark' }}>
        {report.category?.name || 'General'}
        <IconButton
          onClick={(e) => onClose(e)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <img
            src={report.beforeImageUrl ? `${IMAGE_BASE}${report.beforeImageUrl}` : 'https://placehold.co/400x300'}
            alt={report.description}
            crossOrigin="anonymous"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== 'https://placehold.co/400x300') {
                target.src = 'https://placehold.co/400x300';
              }
            }}
          />
        </Box>
        <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap', color: 'text.primary' }}>
          {report.description}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.dark', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon fontSize="small" /> Location
          </Typography>
          <Box sx={{ p: 2, bgcolor: 'surface.main', borderRadius: '12px', mb: 2 }}>
            {isAddressLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">Fetching address...</Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                {address || 'Location provided by coordinates'}
              </Typography>
            )}
          </Box>

          {report.latitude && report.longitude && (
            <Box sx={{ aspectRatio: { xs: '4/3', sm: '16/9' }, width: '100%', minHeight: '15rem', borderRadius: '12px', overflow: 'hidden', border: (theme) => `1px solid ${theme.palette.surface.dark}`, zIndex: 0 }}>
              <MapContainer
                center={[report.latitude, report.longitude]}
                zoom={16}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={[report.latitude, report.longitude]} icon={customMarkerIcon} />
              </MapContainer>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, bgcolor: 'background.default', borderRadius: '12px' }}>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Status:</strong> <span className={`status-chip ${getStatusClass(report.status)}`} style={{ padding: '4px 12px', fontSize: '0.8rem', borderRadius: '12px', fontWeight: 600 }}>{getStatusLabel(report.status)}</span>
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
            <strong>Report ID:</strong> <span>#TR-{report.reportId}</span>
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
            <strong>Reported On:</strong> <span>{format(new Date(report.createdAt), 'MMM d, yyyy HH:mm')}</span>
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
            <strong>Supports:</strong> <span>{supportCount} citizens</span>
          </Typography>
        </Box>
      </DialogContent>
      {!(isMyReport || isOwner) && (
        <DialogActions sx={{ p: 2 }}>
          <Button
            fullWidth
            variant={isSupported ? "contained" : "outlined"}
            startIcon={isSupporting ? <CircularProgress size={20} color="inherit" /> : isSupported ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            onClick={handleSupport}
            disabled={isSupporting}
            sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700 }}
          >
            {isSupported ? 'Supported' : 'I see this too'} ({supportCount})
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
