import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
    authenticated: false,
    credentials: {},
    otherCredentials: {},
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
        case 'SET_OTHER_USER':
            return {
                ...state,
                otherCredentials: action.payload
            }
        case 'DELETE_FLUSH':
            return {
                ...state,
                notifications: state.notifications.filter(notif => notif.flushID !== action.payload)
            }
        case 'FREE_OTHER_USER':
            return {
                ...state,
                otherCredentials: {}
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
