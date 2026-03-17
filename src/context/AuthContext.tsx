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
        localStorage.setItem('cb_has_session', 'true');

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
        localStorage.setItem('cb_has_session', 'false');
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
        // If we have no hint that the user was logged in, don't even try to call the server.
        // This stops the automatic 401 error in console for guest users.
        const sessionHint = localStorage.getItem('cb_has_session');
        if (sessionHint !== 'true') {
            setLoading(false);
            return;
        }

        try {
            const res = await api.getMe();

            if (res.success) {
                const userData = res.data || res.user || (res.email ? res : null);
                if (userData && userData.email) {
                    setIsLoggedIn(true);
                    setEmail(userData.email || '');
                    setDisplayName(userData.name || '');
                    setUserId(userData.id || userData._id || '');
                    setCity(userData.city || '');
                    const rawAvatar = userData.avatar_url || userData.avatar || '';
                    setAvatar(api.formatAvatarUrl(rawAvatar));
                    return;
                }
            }

            // If /me failed (401), we try to refresh the session.
            // Even if no local token, we try because the backend might have an HttpOnly refresh cookie.
            const refreshed = await tryRefreshToken();
            if (refreshed) {
                const retryRes = await api.getMe();
                const retryData = retryRes.data || retryRes.user || (retryRes.email ? retryRes : null);
                if (retryRes.success && retryData && retryData.email) {
                    setIsLoggedIn(true);
                    localStorage.setItem('cb_has_session', 'true');
                    setEmail(retryData.email || '');
                    setDisplayName(retryData.name || '');
                    setUserId(retryData.id || retryData._id || '');
                    setCity(retryData.city || '');
                    const rawAvatar = retryData.avatar_url || retryData.avatar || '';
                    setAvatar(api.formatAvatarUrl(rawAvatar));
                    return;
                }
            }

            // If everything fails, we just ensure we are logged out locally.
            // We DO NOT call api.logout() here to avoid unnecessary 404/401 errors in console on every refresh.
            setIsLoggedIn(false);
            setEmail('');
        } catch (error) {
            console.error('Auth check skipped or failed:', error);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    }, [tryRefreshToken]);

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

    /** Inactivity Timeout: 10 minutes (600,000 ms) */
    useEffect(() => {
        if (!isLoggedIn) return;

        let timeoutId: any;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                console.log('Session expired due to inactivity');
                logout();
            }, 600000); // 10 minutes
        };

        // Events to listen for activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => document.addEventListener(event, resetTimer));

        // Initial start
        resetTimer();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [isLoggedIn, logout]);

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
