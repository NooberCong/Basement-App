import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
    authenticated: false,
    credentials: {},
    likes: [],
    notifications: []
}

const userContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_AUTHENTICATED':
            return {
                ...state,
                authenticated: true
            };
        case 'SET_UNAUTHENTICATED':
            return initialState;
        case 'SET_USER':
            return {
                ...state,
                ...action.payload
            }
        default: throw Error('Action not recognized');
    }
}

export const UserProvider = ({ children }) => {
    const contextValue = useReducer(reducer, initialState);
    return (
        <userContext.Provider value={contextValue}>
            {children}
        </userContext.Provider>
    )
}

export const useUser = () => {
    const contextValue = useContext(userContext);
    if (!contextValue) throw Error('Used outside of provider');
    return contextValue;
}
