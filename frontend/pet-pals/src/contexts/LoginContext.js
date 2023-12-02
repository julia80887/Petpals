import { createContext, useState } from 'react';

export const LoginContext = createContext({
    currentUser: {},
    setCurrentUser: () => { },

});

export const useLoginContext = () => {
    const [currentUser, setCurrentUser] = useState([]);

    return {
        currentUser,
        setCurrentUser
    };

};