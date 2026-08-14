import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  IconButton,
} from '@mui/material';
import NearMeIcon from '@mui/icons-material/NearMe';
import MapIcon from '@mui/icons-material/Map';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';

const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconRetinaUrl: markerIconRetinaUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

type LatLng = { lat: number; lng: number };

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

interface LocationPickerProps {
  showMap: boolean;
  setShowMap: (showMap: boolean) => void;
  onChange?: (location: { latLng: LatLng; address: string }) => void;
  onMapToggle?: (mapShown: boolean) => void;
}

function FlyToMarker({ position }: { position: LatLng }) {
  const map = useMap();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      map.setView([position.lat, position.lng], 15, { animate: false });
    } else {
      map.flyTo([position.lat, position.lng], 15);
    }
  }, [position, map]);
  return null;
}

function MapClickHandler({ onLocationSet }: { onLocationSet: (latLng: LatLng) => void }) {
  useMapEvents({ click: (e) => onLocationSet({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const { road, house_number, city, town, village, suburb } = data.address ?? {};
    const street = [road, house_number].filter(Boolean).join(' ');
    const locality = city ?? town ?? village ?? suburb ?? '';
    return [street, locality].filter(Boolean).join(', ') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

const DEFAULT_CENTER: LatLng = { lat: 32.0853, lng: 34.7818 }; // tel aviv

export function LocationPicker({ showMap, setShowMap, onChange, onMapToggle }: LocationPickerProps) {
  const [markerPos, setMarkerPos] = useState<LatLng>(DEFAULT_CENTER);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLocating, setIsLocating] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitLocation = useCallback(
    async (latLng: LatLng, knownAddress?: string) => {
      setMarkerPos(latLng);
      const address = knownAddress ?? (await reverseGeocode(latLng.lat, latLng.lng));
      setInputValue(address);
      setSuggestions([]);
      onChange?.({ latLng, address });
    },
    [onChange]
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await commitLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { timeout: 6000, maximumAge: 60000 }
    );
  }, [commitLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSuggestions([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) return;

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
      } catch {
        // silently fail
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSuggestionClick = (result: NominatimResult) => {
    commitLocation(
      { lat: parseFloat(result.lat), lng: parseFloat(result.lon) },
      result.display_name
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        variant="caption"
        sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}
      >
        Location
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <TextField
          fullWidth
          placeholder="Search for an address..."
          value={inputValue}
          onChange={handleInputChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  {isLocating || isSearching ? (
                    <CircularProgress size={18} sx={{ color: 'info.main' }} />
                  ) : (
                    <NearMeIcon sx={{ color: 'info.main', fontSize: 20 }} />
                  )}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      const next = !showMap;
                      setShowMap(next);
                      onMapToggle?.(next);
                    }}
                    title={showMap ? 'Hide map' : 'Show on map'}
                  >
                    {showMap ? (
                      <KeyboardArrowUpIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                    ) : (
                      <MapIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'surface.main',
              borderRadius: '0.5rem',
              '& fieldset': { border: 'none' },
            },
            '& input': { color: 'text.secondary', fontSize: '0.9rem', fontWeight: 600 },
          }}
        />
        {suggestions.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1300,
              bgcolor: 'background.paper',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              border: '1px solid',
              borderColor: 'surface.dark',
              mt: 0.5,
              overflow: 'hidden',
            }}
          >
            <List dense disablePadding>
              {suggestions.map((s) => (
                <ListItemButton
                  key={s.place_id}
                  onClick={() => handleSuggestionClick(s)}
                  sx={{ px: 2, py: 1, '&:hover': { bgcolor: 'surface.main' } }}
                >
                  <ListItemText
                    primary={s.display_name}
                    slotProps={{
                      primary: { variant: 'body2', sx: { color: 'text.primary', fontSize: '0.85rem' } },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}
      </Box>
      <Collapse in={showMap}>
        <Box
          sx={{
            height: '10.4rem',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            border: '1.5px solid',
            borderColor: 'surface.dark',
            position: 'relative',
            zIndex: 0,
          }}
        >
          <MapContainer
            center={[markerPos.lat, markerPos.lng]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationSet={(ll) => commitLocation(ll)} />
            <Marker position={[markerPos.lat, markerPos.lng]} />
            <FlyToMarker position={markerPos} />
          </MapContainer>
        </Box>
      </Collapse>
    </Box>
  );
}
