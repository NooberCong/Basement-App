import React, { createContext, useReducer, useContext } from 'react';
const initialState = {
    all: [],
    specific: {}
}

const flushContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ALL_FLUSHES':
            return {
                ...state,
                all: action.payload
            };
        case 'LIKE_FLUSH':
        case 'UNLIKE_FLUSH':
            state.all[state.all.findIndex(flush => flush.flushID === action.payload.flushID)] = action.payload;
            return {
                ...state
            }
        case 'DELETE_FLUSH':
            return {
                ...state,
                all: state.all.filter(flush => flush.flushID !== action.payload)
            }
        case 'POST_FLUSH':
            return {
                ...state,
                all: [action.payload, ...state.all]
            }
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