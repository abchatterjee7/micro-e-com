import { createContext, useState, useEffect, type ReactNode } from 'react';
import keycloak from '../keycloak';

interface AuthContextType {
    user: any;
    login: () => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    token: string | undefined;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    isAdmin: false,
    token: undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (keycloak.authenticated) {
            // Keycloak token parsed has user info
            const profile = keycloak.tokenParsed;
            setUser({
                username: profile?.preferred_username || profile?.sub,
                firstName: profile?.given_name || profile?.name?.split(' ')[0] || '',
                lastName: profile?.family_name || profile?.name?.split(' ')[1] || '',
                email: profile?.email,
                id: profile?.sub,
                roles: keycloak.realmAccess?.roles || []
            });
        }
    }, []);

    const login = () => {
        keycloak.login();
    };

    const logout = () => {
        keycloak.logout({ redirectUri: window.location.origin });
    };

    const isAdmin = keycloak.hasRealmRole('ADMIN');

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!keycloak.authenticated,
            isAdmin,
            token: keycloak.token
        }}>
            {children}
        </AuthContext.Provider>
    );
};
