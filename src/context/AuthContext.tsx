import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    mobile: string;
    displayName: string;
    email: string;
    login: (mobile: string) => void;
    logout: () => void;
    updateProfile: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
        () => localStorage.getItem('isLoggedIn') === 'true'
    );
    const [mobile, setMobile] = useState<string>(
        () => localStorage.getItem('userMobile') || ''
    );
    const [displayName, setDisplayName] = useState<string>(
        () => localStorage.getItem('userDisplayName') || ''
    );
    const [email, setEmail] = useState<string>(
        () => localStorage.getItem('userEmail') || ''
    );

    const login = useCallback((mob: string) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userMobile', mob);
        setIsLoggedIn(true);
        setMobile(mob);
        // Restore any previously saved profile for this number
        const savedName = localStorage.getItem('userDisplayName') || '';
        const savedEmail = localStorage.getItem('userEmail') || '';
        setDisplayName(savedName);
        setEmail(savedEmail);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userMobile');
        setIsLoggedIn(false);
        setMobile('');
        setDisplayName('');
        setEmail('');
    }, []);

    const updateProfile = useCallback((name: string, emailVal: string) => {
        localStorage.setItem('userDisplayName', name);
        localStorage.setItem('userEmail', emailVal);
        setDisplayName(name);
        setEmail(emailVal);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, mobile, displayName, email, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
