import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { LatLngBoundsLiteral, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { useAllReports } from '../../hooks/useReports';
import { ReportCard } from '../../components/ReportCard';
import { supportReport } from '../../api/reportApi';
import { toast } from 'react-toastify';
import { useAuthUser } from '@/features/auth/hooks/useAuth';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const ISRAEL_CENTER: LatLngTuple = [31.7683, 35.2137];
const ISRAEL_BOUNDS: LatLngBoundsLiteral = [
  [27.5, 31.5],
  [36.5, 38.5],
];

const createPinIcon = (color: string) => {
  return new L.DivIcon({
    html: `
      <div style="
        background-color: ${color}; 
        width: 30px; 
        height: 30px; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        border: 2px solid white; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px; 
          height: 10px; 
          background-color: white; 
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    className: 'custom-pin-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const HomePage = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerClusterGroupRef = useRef<any>(null);
  const [view, setView] = useState<'list' | 'map'>('map');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [userPosition, setUserPosition] = useState<LatLngTuple | null>(null);
  const { data: reports, isLoading, refetch } = useAllReports();
  const { data: currentUser } = useAuthUser();
  const [isSupporting, setIsSupporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.role === 'Worker') {
      navigate('/worker/pool');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (view === 'map' && leafletMap.current) {
      setTimeout(() => {
        leafletMap.current?.invalidateSize();
      }, 100);
    }
  }, [view]);

  useEffect(() => {
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  const isSupported = selectedReport?.supports?.some((s: any) => s.userId === currentUser?.userId);
  const isMyReport = currentUser?.userId === selectedReport?.requesterId;

  useEffect(() => {
    if (view !== 'map' || !mapRef.current || reports === undefined) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        center: ISRAEL_CENTER,
        zoom: 8,
        minZoom: 5,
        maxZoom: 18,
        maxBounds: ISRAEL_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.current);
    }

    const map = leafletMap.current;

    // Clean up previous marker cluster group if exists
    if (markerClusterGroupRef.current) {
      map.removeLayer(markerClusterGroupRef.current);
      markerClusterGroupRef.current = null;
    }

    // Clean up any stray markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Create custom marker cluster group
    const clusterGroup = (L as any).markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div class="custom-cluster-icon">${count}</div>`,
          className: 'custom-cluster-icon-wrapper',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });
      },
    });

    reports.forEach((report) => {
      const marker = L.marker([report.latitude, report.longitude], {
        icon: createPinIcon('#ef5f43'),
      });

      marker.on('click', () => {
        setSelectedReport(report);
        map.setView([report.latitude, report.longitude], map.getZoom(), { animate: true });
      });

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);
    markerClusterGroupRef.current = clusterGroup;

    if (userPosition) {
      L.circleMarker(userPosition, {
        radius: 9,
        color: '#2f4f78',
        fillColor: '#4785d9',
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(map).bindPopup('You are here');
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const pos: LatLngTuple = [coords.latitude, coords.longitude];
        setUserPosition(pos);
        L.circleMarker(pos, {
          radius: 9,
          color: '#2f4f78',
          fillColor: '#4785d9',
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);
        map.setView(pos, 15, { animate: true });
      });
    }
  }, [view, reports, userPosition]);

  const handleSupport = async () => {
    if (!selectedReport || isSupporting) return;
    if (isMyReport) {
      toast.info("You cannot support your own report.");
      return;
    }
    setIsSupporting(true);
    try {
      const res = await supportReport(selectedReport.reportId);
      toast.success(res.message);
      refetch();
      // Update local state for immediate feedback
      setSelectedReport({
        ...selectedReport,
        supportCount: res.supportCount,
        supports: res.supported
          ? [...(selectedReport.supports || []), { userId: currentUser?.userId }]
          : (selectedReport.supports || []).filter((s: any) => s.userId !== currentUser?.userId)
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update support.');
    } finally {
      setIsSupporting(false);
    }
  };

  const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000/api';
  const IMAGE_BASE = API_BASE.replace('/api', '');

  const isCitizen = currentUser?.role === 'Citizen';
  const pageTitle = isCitizen ? 'Home' : 'Map';

  return (
    <Box className="home-page">
      <Box className="home-page__header-v2">
        <Typography variant="h1" sx={{ color: 'white', mb: 2, fontSize: '1.5rem', width: '100%', maxWidth: '400px', textAlign: 'left' }}>
          {pageTitle}
        </Typography>
        <Box className="view-toggle">
          <Button
            className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            List
          </Button>
          <Button
            className={`toggle-btn ${view === 'map' ? 'active' : ''}`}
            onClick={() => setView('map')}
          >
            Map
          </Button>
        </Box>
      </Box>

      <Box className="map-container-v2" sx={{ display: view === 'map' ? 'block' : 'none' }}>
        <div ref={mapRef} className="home-page__map" />

        {selectedReport && (
          <Box className="floating-report-card">
            <IconButton
              className="close-btn"
              size="small"
              onClick={() => setSelectedReport(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            <Box className="card-content">
              <img
                src={selectedReport.beforeImageUrl ? `${IMAGE_BASE}${selectedReport.beforeImageUrl}` : 'https://placehold.co/80'}
                alt={selectedReport.description}
                className="card-image"
              />
              <Box className="card-info">
                <Typography className="card-title">
                  {selectedReport.category?.name || 'Broken Streetlight'}
                </Typography>
                <Typography className="card-subtitle">
                  {selectedReport.description.length > 30
                    ? selectedReport.description.substring(0, 30) + '...'
                    : selectedReport.description} • {selectedReport.status}
                </Typography>
              </Box>
            </Box>

            {!(isSupporting || isMyReport) && (
              <Button
                fullWidth
                className="support-btn"
                startIcon={isSupporting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isSupported ? (
                  <ThumbUpIcon />
                ) : (
                  <ThumbUpOutlinedIcon />
                )}
                onClick={handleSupport}
              >
                {isSupported ? 'Supported' : 'I see this too'} ({selectedReport.supportCount || 0})
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box className="list-container-v2" sx={{ display: view === 'list' ? 'flex' : 'none' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : reports && reports.length > 0 ? (
          reports.map((report: any) => (
            <ReportCard key={report.reportId} report={report} />
          ))
        ) : (
          <Typography sx={{ textAlign: 'center', mt: 4, opacity: 0.6 }}>
            No reports found.
          </Typography>
        )}
      </Box>
    </Box >
  );
};

export default HomePage;
