import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { api } from '../utils/api';

interface UserData {
    email: string;
    name?: string;
    id?: string;
    city?: string;
    avatar?: string;
    avatar_url?: string;
    country_code?: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    loading: boolean; // true only during the initial silent auth check
    email: string;
    displayName: string;
    userId: string;
    city: string;
    avatar: string;
    countryCode: string;
    login: (userData: UserData, tokens?: { access: string; refresh: string }) => void;
    logout: () => void;
    updateProfile: (name: string, city?: string, avatar?: string, countryCode?: string) => Promise<{ success: boolean; message: string }>;
    refreshUser: () => Promise<void>;
    deleteAccount: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // Start as NOT loading — public pages render immediately.
    // We only do a silent check if tokens exist in localStorage.
    const [loading, setLoading] = useState<boolean>(() => {
        // Only block UI if we have tokens and need to verify them
        return !!(localStorage.getItem('access_token') || localStorage.getItem('refresh_token'));
    });
    const [email, setEmail] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');
    const [countryCode, setCountryCode] = useState<string>('');
    const initialCheckDone = useRef(false);

    const setUserFromData = useCallback((userData: any) => {
        setIsLoggedIn(true);
        setEmail(userData.email || '');
        setDisplayName(userData.name || '');
        setUserId(userData.id || userData._id || '');
        setCity(userData.city || '');
        setCountryCode(userData.country_code || '');
        const rawAvatar = userData.avatar_url || userData.avatar || '';
        setAvatar(api.formatAvatarUrl(rawAvatar));
    }, []);

    const login = useCallback((userData: UserData, tokens?: { access: string; refresh: string }) => {
        if (tokens) {
            localStorage.setItem('access_token', tokens.access);
            if (tokens.refresh) localStorage.setItem('refresh_token', tokens.refresh);
        }
        setUserFromData(userData);
    }, [setUserFromData]);

    const logout = useCallback(async () => {
        try { await api.logout(); } catch { /* ignore */ }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('cb_has_session');
        setIsLoggedIn(false);
        setEmail('');
        setDisplayName('');
        setUserId('');
        setCity('');
        setAvatar('');
        setCountryCode('');
    }, []);

    const tryRefreshToken = useCallback(async (): Promise<boolean> => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return false;
        try {
            const res = await api.refreshToken(refreshToken);
            const newToken = res.token || res.access_token;
            if (res.success && newToken) {
                localStorage.setItem('access_token', newToken);
                return true;
            }
        } catch { /* ignore */ }
        return false;
    }, []);

    const refreshUser = useCallback(async () => {
        const hasAccess = !!localStorage.getItem('access_token');
        const hasRefresh = !!localStorage.getItem('refresh_token');

        // If no tokens at all, skip entirely — user is a guest
        if (!hasAccess && !hasRefresh) {
            setLoading(false);
            return;
        }

        try {
            // 8s timeout so users aren't stuck forever on slow network
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const res = await api.getMe();
            clearTimeout(timeoutId);

            if (res.success) {
                const userData = res.data || res.user || (res.email ? res : null);
                if (userData?.email) {
                    setUserFromData(userData);
                    return;
                }
            }

            // /me returned error — try refresh token
            const refreshed = await tryRefreshToken();
            if (refreshed) {
                const retryRes = await api.getMe();
                const retryData = retryRes.data || retryRes.user || (retryRes.email ? retryRes : null);
                if (retryRes.success && retryData?.email) {
                    setUserFromData(retryData);
                    return;
                }
            }

            // Tokens invalid — clear them silently
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setIsLoggedIn(false);
        } catch {
            // Network error or timeout — clear state so user can log in again
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    }, [setUserFromData, tryRefreshToken]);

    /** Update profile via API and sync state on success */
    const updateProfile = useCallback(async (
        name: string,
        cityVal?: string,
        avatarVal?: string,
        countryCodeVal?: string
    ): Promise<{ success: boolean; message: string }> => {
        try {
            const payload: { name?: string; city?: string; avatar?: string; country_code?: string } = {};
            if (name) payload.name = name;
            if (cityVal !== undefined) payload.city = cityVal;
            if (avatarVal !== undefined) payload.avatar = avatarVal;
            if (countryCodeVal !== undefined) payload.country_code = countryCodeVal;

            const res = await api.updateMe(payload);
            if (res.success) {
                if (name) setDisplayName(name);
                if (cityVal !== undefined) setCity(cityVal);
                if (avatarVal !== undefined) setAvatar(api.formatAvatarUrl(avatarVal));
                if (countryCodeVal !== undefined) setCountryCode(countryCodeVal);
            }
            return { success: res.success, message: res.message };
        } catch {
            return { success: false, message: 'Connection error. Please try again.' };
        }
    }, []);

    const deleteAccount = useCallback(async (): Promise<{ success: boolean; message: string }> => {
        try {
            const res = await api.deleteMe();
            if (res.success) await logout();
            return { success: res.success, message: res.message };
        } catch {
            return { success: false, message: 'Connection error. Please try again.' };
        }
    }, [logout]);

    /** Silent auth check on app mount — only runs once, only if tokens exist */
    useEffect(() => {
        if (initialCheckDone.current) return;
        initialCheckDone.current = true;
        refreshUser();
    }, [refreshUser]);

    /** Inactivity Timeout: 10 minutes */
    useEffect(() => {
        if (!isLoggedIn) return;
        let timeoutId: ReturnType<typeof setTimeout>;
        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => logout(), 600000);
        };
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(e => document.addEventListener(e, resetTimer));
        resetTimer();
        return () => {
            clearTimeout(timeoutId);
            events.forEach(e => document.removeEventListener(e, resetTimer));
        };
    }, [isLoggedIn, logout]);

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            loading,
            email,
            displayName,
            userId,
            city,
            avatar,
            countryCode,
            login,
            logout,
            updateProfile,
            refreshUser,
            deleteAccount
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
