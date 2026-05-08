export type City = {
  id: number;
  name: string;
};

export type CitiesResponse = {
  cities: City[];
  total: number;
  page: number;
  limit: number;
};
//TODOD - implement real API call to fetch cities with pagination and search
// Mock cities data
const MOCK_CITIES: City[] = [
  { id: 1, name: 'Tel Aviv' },
  { id: 2, name: 'Jerusalem' },
  { id: 3, name: 'Haifa' },
  { id: 4, name: 'Rishon LeZion' },
  { id: 5, name: 'Petah Tikva' },
  { id: 6, name: 'Ashdod' },
  { id: 7, name: 'Netanya' },
  { id: 8, name: 'Beer Sheva' },
  { id: 9, name: 'Bnei Brak' },
  { id: 10, name: 'Holon' },
  { id: 11, name: 'Ramat Gan' },
  { id: 12, name: 'Rehovot' },
  { id: 13, name: 'Bat Yam' },
  { id: 14, name: 'Ashkelon' },
  { id: 15, name: 'Jaffa' },
  { id: 16, name: 'Herzliya' },
  { id: 17, name: 'Kfar Saba' },
  { id: 18, name: "Ra'anana" },
  { id: 19, name: 'Hadera' },
  { id: 20, name: 'Lod' },
];

export async function getCities(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<CitiesResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredCities = MOCK_CITIES;

  if (search) {
    filteredCities = MOCK_CITIES.filter((city) =>
      city.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const total = filteredCities.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const cities = filteredCities.slice(startIndex, endIndex);

  return {
    cities,
    total,
    page,
    limit,
  };
}
