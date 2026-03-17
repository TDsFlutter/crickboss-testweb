import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../utils/api';

interface UserData {
    email: string;
    name?: string;
    id?: string;
    city?: string;
    avatar?: string;
    avatar_url?: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    loading: boolean;
    email: string;
    displayName: string;
    userId: string;
    city: string;
    avatar: string;
    login: (userData: UserData, tokens?: { access: string; refresh: string }) => void;
    logout: () => void;
    updateProfile: (name: string, city?: string, avatar?: string) => Promise<{ success: boolean; message: string }>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [email, setEmail] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');

    const login = useCallback((userData: UserData, tokens?: { access: string; refresh: string }) => {
        // We no longer save tokens to localStorage for Web to prevent XSS.
        // The backend now handles this via HttpOnly cookies.
        // (Accessing tokens from JSON is only for secondary/mobile-like use cases).
        setIsLoggedIn(true);

        setIsLoggedIn(true);
        setEmail(userData.email);
        setDisplayName(userData.name || '');
        setUserId(userData.id || '');
        setCity(userData.city || '');
        const rawAvatar = userData.avatar_url || userData.avatar || '';
        setAvatar(api.formatAvatarUrl(rawAvatar));
    }, []);

    const logout = useCallback(async () => {
        try {
            // Tell backend to clear HttpOnly cookies
            await api.logout();
        } catch {
            // ignore
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        setEmail('');
        setDisplayName('');
        setUserId('');
        setCity('');
        setAvatar('');
    }, []);

    /** Tries to refresh the access token using the stored refresh token.
     *  Returns true if successful, false otherwise. */
    const tryRefreshToken = useCallback(async (): Promise<boolean> => {
        const refreshToken = localStorage.getItem('refresh_token');
        // Even if no local token, we try calling refresh because the backend might have an HttpOnly cookie.
        try {
            const res = await api.refreshToken(refreshToken || undefined);
            const newToken = res.token || res.access_token;
            if (res.success && newToken) {
                // We keep access_token in state if needed, but for Web we rely on cookies.
                // We stop updating localStorage for cookies to be the primary source.
                return true;
            }
            // If backend returned success without JSON tokens, it means it updated the HttpOnly cookies.
            if (res.success) return true;
        } catch {
            // ignore
        }
        return false;
    }, []);

    const refreshUser = useCallback(async () => {
        // We no longer check for a local token before starting. 
        // The browser will automatically send the HttpOnly cookie if it exists.
        // However, we still support the Authorization header as a fallback/sync method.
        const token = localStorage.getItem('access_token');

        try {
            let res = await api.getMe();

            // On failure, try to refresh the token once and retry
            if (!res.success) {
                const refreshed = await tryRefreshToken();
                if (refreshed) {
                    res = await api.getMe();
                }
            }

            // Handle nested (res.data), flat (res.user), or root-level user object (if backend returns user fields directly)
            const userData = res.data || res.user || (res.email ? res : null);
            
            if (res.success && userData && userData.email) {
                setIsLoggedIn(true);
                setEmail(userData.email || '');
                setDisplayName(userData.name || '');
                setUserId(userData.id || userData._id || '');
                setCity(userData.city || '');
                const rawAvatar = userData.avatar_url || userData.avatar || '';
                setAvatar(api.formatAvatarUrl(rawAvatar));
            } else {
                logout();
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout, tryRefreshToken]);

    /** Update profile via API and sync state on success */
    const updateProfile = useCallback(async (
        name: string,
        cityVal?: string,
        avatarVal?: string
    ): Promise<{ success: boolean; message: string }> => {
        try {
            const payload: { name?: string; city?: string; avatar?: string } = {};
            if (name) payload.name = name;
            if (cityVal !== undefined) payload.city = cityVal;
            if (avatarVal !== undefined) payload.avatar = avatarVal;

            const res = await api.updateMe(payload);
            if (res.success) {
                if (name) setDisplayName(name);
                if (cityVal !== undefined) setCity(cityVal);
                if (avatarVal !== undefined) setAvatar(api.formatAvatarUrl(avatarVal));
            }
            return { success: res.success, message: res.message };
        } catch (error) {
            return { success: false, message: 'Connection error. Please try again.' };
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            loading,
            email,
            displayName,
            userId,
            city,
            avatar,
            login,
            logout,
            updateProfile,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
