const API_BASE = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:3000/api';
const IMAGE_BASE = API_BASE.replace('/api', '');
export const getImageUrl = (path?: string | null, fallbackUrl: string = 'https://placehold.co/200'): string => {
    if (!path) return fallbackUrl;
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    return `${IMAGE_BASE}${path}`;
};
