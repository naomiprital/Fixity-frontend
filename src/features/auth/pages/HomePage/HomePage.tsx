import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { LatLngBoundsLiteral, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './HomePage.css';

type ComplaintPin = {
  id: number;
  title: string;
  category: string;
  position: LatLngTuple;
};

const ISRAEL_CENTER: LatLngTuple = [31.7683, 35.2137];
const ISRAEL_BOUNDS: LatLngBoundsLiteral = [
  [29.45, 34.2],
  [33.35, 35.92],
];

const MOCK_COMPLAINTS: ComplaintPin[] = [
  { id: 1, title: 'Broken street light', category: 'Infrastructure', position: [32.0853, 34.7818] },
  { id: 2, title: 'Overflowing trash bin', category: 'Sanitation', position: [31.252, 34.7915] },
  { id: 3, title: 'Pothole on main road', category: 'Roads', position: [32.794, 34.9896] },
  { id: 4, title: 'Damaged park bench', category: 'Public spaces', position: [31.0461, 34.8516] },
  { id: 5, title: 'Graffiti on wall', category: 'Cleanliness', position: [32.1093, 34.8555] },
];

const HomePage = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [userPosition, setUserPosition] = useState<LatLngTuple | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = L.map(mapRef.current, {
      center: ISRAEL_CENTER,
      zoom: 8,
      minZoom: 7,
      maxZoom: 18,
      maxBounds: ISRAEL_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      worldCopyJump: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    MOCK_COMPLAINTS.forEach((complaint) => {
      const marker = L.circleMarker(complaint.position, {
        radius: 7,
        color: '#d04835',
        fillColor: '#ef5f43',
        fillOpacity: 0.92,
        weight: 2,
      }).addTo(map);

      marker.bindPopup(`<strong>${complaint.title}</strong><br/>${complaint.category}`);
    });

    if (!navigator.geolocation) {
      setLocationError('Location is not supported on this device.');
      return () => map.remove();
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position: LatLngTuple = [coords.latitude, coords.longitude];
        setUserPosition(position);

        const userMarker = L.circleMarker(position, {
          radius: 9,
          color: '#2f4f78',
          fillColor: '#4785d9',
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);

        userMarker.bindPopup('You are here');
        map.setView(position, 16, { animate: true });
      },
      () => {
        setLocationError('Could not fetch your location. Showing default Israel view.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );

    return () => {
      map.remove();
    };
  }, []);

  return (
    <section className="home-page">
      <header className="home-page__header">
        <h1 className="home-page__title">Complaints Map</h1>
        <p className="home-page__subtitle">Israel only. Your location is shown in blue.</p>
      </header>

      {locationError && <p className="home-page__error">{locationError}</p>}

      <div className="home-page__map-shell">
        <div ref={mapRef} className="home-page__map" aria-label="Israel complaints map" />
      </div>

      {userPosition && (
        <p className="home-page__location">
          Your location: {userPosition[0].toFixed(4)}, {userPosition[1].toFixed(4)}
        </p>
      )}
    </section>
  );
};

export default HomePage;
