import { useQuery } from '@tanstack/react-query';
import type { AuthUser } from '../features/auth/api/authApi';

const getLocalAuthUser = (): AuthUser | null => {
    const authDataString = localStorage.getItem('fixity.auth');
    if (!authDataString) return null;
    try {
        const parsed = JSON.parse(authDataString);
        return parsed.user || null;
    } catch {
        return null;
    }
};

export const useAuthUser = () => {
    return useQuery<AuthUser | null>({
        queryKey: ['auth-user'],
        queryFn: getLocalAuthUser,
        initialData: getLocalAuthUser,
    });
};
