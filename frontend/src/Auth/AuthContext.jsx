/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";

const initialState = {
    token: localStorage.getItem("token") || null,
    name: localStorage.getItem("name") || null, // 
};

export const AuthContext = createContext(initialState);

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("name", action.payload.name); 
            return {
                ...state,
                token: action.payload.token,
                name: action.payload.name,
            };
        case "LOGOUT":
            localStorage.removeItem("token"); 
            localStorage.removeItem("name"); 
            return {
                ...state,
                token: null,
                name: null, 
            };
        default:
            return state;
    }
};

// Context Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
