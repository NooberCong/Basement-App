import React, { createContext, useReducer, useContext } from 'react';
const initialState = {
    all: [],
    specific: {}
}

const flushContext = createContext();

const reducer = (state, action) => {
    switch(action.type) {
        case 'SET_ALL_FLUSHES':
            return {
                ...state,
                all: action.payload
            };
        default: return state;
    }
}

export const FlushProvider = ({ children }) => {
    const contextValue = useReducer(reducer, initialState);
    return (
        <flushContext.Provider value={contextValue}>
            {children}
        </flushContext.Provider>
    );
}

export const useFlush = () => {
    const contextValue = useContext(flushContext);
    if (!contextValue) throw Error('Used outside of provider');
    return contextValue;
}