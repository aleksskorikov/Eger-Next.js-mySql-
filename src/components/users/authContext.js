"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser?.email !== user?.email) {
                    setUser(parsedUser);
                }
            }
        }
    }, [user]);

    const login = (userData) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(userData));
        }
        setUser(userData);
    };

    const logout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
