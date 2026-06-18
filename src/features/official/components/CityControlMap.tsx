import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import { useAuthUser } from '@/features/auth/hooks/useAuth';
import { useMayorMapDensity } from '../api/mayorApi';
import './CityControlMap.css';

const DEFAULT_CENTER: L.LatLngTuple = [32.0853, 34.7818];

export const CityControlMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Faults');
  const [mapCenter, setMapCenter] = useState<L.LatLngTuple>(DEFAULT_CENTER);

  const { data: user } = useAuthUser();
  const { data: densityData, isLoading } = useMayorMapDensity(selectedCategory);

  // Categories list matching Figma
  const categories = ['All Faults', 'Potholes', 'Water'];

  // Geocode the city name dynamically using OpenStreetMap Nominatim if GPS isn't active
  useEffect(() => {
    if (!user?.cityName) return;

    const geocodeCity = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(user.cityName || '')}&limit=1`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const coords: L.LatLngTuple = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          setMapCenter(coords);
          if (mapInstance.current) {
            mapInstance.current.setView(coords, 13);
          }
        }
      } catch (err) {
        console.error('OSM Nominatim Geocoding failed, using fallback:', err);
      }
    };

    geocodeCity();
  }, [user?.cityName]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapContainerRef.current, {
        center: mapCenter,
        zoom: 13,
        minZoom: 10,
        maxZoom: 18,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current);

      layersGroupRef.current = L.layerGroup().addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        layersGroupRef.current = null;
      }
    };
  }, []);

  // Request browser geolocation once user is loaded
  useEffect(() => {
    if (!mapInstance.current || !user) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const userPos: L.LatLngTuple = [coords.latitude, coords.longitude];
          mapInstance.current?.setView(userPos, 14, { animate: true });

          // Add a circle marker to show "You are here"
          if (layersGroupRef.current) {
            L.circleMarker(userPos, {
              radius: 8,
              color: '#2f4f78',
              fillColor: '#4785d9',
              fillOpacity: 0.9,
              weight: 2,
            })
              .addTo(layersGroupRef.current)
              .bindPopup('You are here');
          }
        },
        (error) => {
          console.log('Geolocation not active or denied, centering on geocoded city: ', error);
          mapInstance.current?.setView(mapCenter, 13);
        }
      );
    } else {
      mapInstance.current?.setView(mapCenter, 13);
    }
  }, [user, mapCenter]);

  // Sync size when visible
  useEffect(() => {
    if (mapInstance.current) {
      setTimeout(() => {
        mapInstance.current?.invalidateSize();
      }, 200);
    }
  }, [densityData]);

  // Update map overlays when data changes
  useEffect(() => {
    if (!mapInstance.current || !layersGroupRef.current || !densityData) return;

    // Clear previous layers
    layersGroupRef.current.clearLayers();

    // Map bounds to auto-fit markers
    const bounds: L.LatLngExpression[] = [];

    densityData.forEach((item) => {
      const isCritical = item.severity === 'Critical' || item.severity === 'High';
      const color = isCritical ? '#ef4444' : '#f97316';
      const fillColor = isCritical ? '#fee2e2' : '#ffedd5';
      const label = selectedCategory === 'Potholes' ? 'POTHOLES' : selectedCategory === 'Water' ? 'WATER' : 'REPORTS';

      // Circle representing density
      const circle = L.circle([item.lat, item.lng], {
        color,
        fillColor,
        fillOpacity: 0.75,
        weight: 2,
        radius: 150 + item.density * 30, // radius in meters
      }).addTo(layersGroupRef.current!);

      // Popup content on hover/click
      circle.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 0.25rem;">
          <strong style="color: ${color};">${item.severity.toUpperCase()} CLUSTER</strong><br/>
          Density: ${item.density} reported items
        </div>
      `);

      // Permanent tooltip bubble pointing to the center for example: "42 REPORTS"
      circle.bindTooltip(`${item.density} ${label}`, {
        permanent: true,
        direction: 'center',
        className: `custom-map-tooltip ${isCritical ? 'tooltip-critical' : 'tooltip-moderate'}`,
      });

      bounds.push([item.lat, item.lng]);
    });

    // Fit map bounds if clusters exist
    if (bounds.length > 0 && mapInstance.current) {
      mapInstance.current.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    } else {
      mapInstance.current.setView(mapCenter, 13);
    }
  }, [densityData, selectedCategory, mapCenter]);

  return (
    <Box className="city-control-map">
      {/* City Control Sub-Header */}
      <Box className="city-control-header">
        <Box className="city-control-header__info">
          <Typography variant="h5" className="city-control-title">
            City Control
          </Typography>
          <Typography variant="caption" className="city-control-subtitle">
            LIVE DENSITY MAP
          </Typography>
        </Box>
      </Box>

      {/* Categories Filter Chips Row */}
      <Box className="map-filters-row">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`map-filter-chip ${selectedCategory === cat ? 'map-filter-chip--active' : ''}`}
          />
        ))}
      </Box>

      {/* Map Area */}
      <Box className="map-canvas-container">
        {isLoading && (
          <Box className="map-loading-overlay">
            <CircularProgress size={40} color="primary" />
          </Box>
        )}
        <div ref={mapContainerRef} className="map-canvas" />

        {/* Legend Box Over Map */}
        <Box className="map-legend">
          <Typography variant="caption" className="map-legend-title">
            FAULT DENSITY
          </Typography>
          <Box className="map-legend-item">
            <Box className="legend-dot legend-dot--critical" />
            <Typography variant="caption" className="legend-text">
              Critical (10+)
            </Typography>
          </Box>
          <Box className="map-legend-item">
            <Box className="legend-dot legend-dot--moderate" />
            <Typography variant="caption" className="legend-text">
              Moderate (5-9)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
