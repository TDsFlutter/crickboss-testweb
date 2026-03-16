import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    email: string;
    displayName: string;
    login: (email: string) => void;
    logout: () => void;
    updateProfile: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        () => localStorage.getItem('isLoggedIn') === 'true'
    );
    const [email, setEmail] = useState<string>(
        () => localStorage.getItem('userEmail') || ''
    );
    const [displayName, setDisplayName] = useState<string>(
        () => localStorage.getItem('userDisplayName') || ''
    );

    const login = useCallback((userEmail: string) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', userEmail);
        setIsLoggedIn(true);
        setEmail(userEmail);
        // Restore any previously saved display name
        const savedName = localStorage.getItem('userDisplayName') || '';
        setDisplayName(savedName);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        setEmail('');
        setDisplayName('');
    }, []);

    const updateProfile = useCallback((name: string) => {
        localStorage.setItem('userDisplayName', name);
        setDisplayName(name);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, email, displayName, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
