import { useQuery } from '@tanstack/react-query';
import type { LatLngBoundsLiteral, LatLngTuple } from 'leaflet';
import axios from 'axios';

export interface CityBoundsData {
  center: LatLngTuple;
  bounds: LatLngBoundsLiteral;
}

const fetchCityBounds = async (
  cityName: string | null | undefined
): Promise<CityBoundsData | null> => {
  if (!cityName) return null;

  const res = await axios.get(
    `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&country=Israel&format=json`
  );
  const data = res.data;

  if (data && data.length > 0) {
    const cityData = data[0];
    const boundingbox = cityData.boundingbox;

    const bounds: LatLngBoundsLiteral = [
      [parseFloat(boundingbox[0]), parseFloat(boundingbox[2])],
      [parseFloat(boundingbox[1]), parseFloat(boundingbox[3])],
    ];

    const center: LatLngTuple = [parseFloat(cityData.lat), parseFloat(cityData.lon)];

    return { center, bounds };
  }

  return null;
};

export const useCityBounds = (cityName: string | null | undefined) => {
  return useQuery({
    queryKey: ['city-bounds', cityName],
    queryFn: () => fetchCityBounds(cityName),
    enabled: !!cityName,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
