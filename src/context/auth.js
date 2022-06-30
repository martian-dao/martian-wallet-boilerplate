import { createContext, useContext, useMemo, useState } from 'react';

const initialState = {};

export const AuthContext = createContext(initialState);

export const AuthProvider = (props) => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [account, setAccount] = useState(initialState);

    const setAuthAccount = (account) => {
        setAuthenticated(true);
        setAccount(account);
    };

    const value = useMemo(
        () => ({
            isAuthenticated,
            account,
            setAuthAccount,

        }),
        [account, isAuthenticated],
    );

    return <AuthContext.Provider value={value} {...props} />;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
