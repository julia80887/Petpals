import { createContext, useState, useContext } from 'react';

export const LoginContext = createContext({
    currentUser: {},
    setCurrentUser: () => { },
});

export const useLoginContext = () => {
    // Use the context created above
    const contextValue = useContext(LoginContext);

    return {
        currentUser: contextValue.currentUser || {},
        setCurrentUser: contextValue.setCurrentUser || (() => { }),
    };
};
