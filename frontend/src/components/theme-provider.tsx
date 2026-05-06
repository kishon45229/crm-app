"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = React.useState<ThemeMode>(() => {
        // Initialize from session storage, default to 'light' if not found
        if (typeof window !== 'undefined') {
            const savedTheme = sessionStorage.getItem('theme');
            return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
        }
        return 'light';
    });

    const toggleTheme = React.useCallback(() => {
        setMode((prevMode) => {
            const newMode = prevMode === "light" ? "dark" : "light";
            // Save to session storage
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('theme', newMode);
            }
            return newMode;
        });
    }, []);

    const theme = mode === "light" ? lightTheme : darkTheme;

    const contextValue = React.useMemo(
        () => ({
            mode,
            toggleTheme,
        }),
        [mode, toggleTheme]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}