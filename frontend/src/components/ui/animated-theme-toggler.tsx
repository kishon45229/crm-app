"use client";

import * as React from "react";
import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@/components/theme-provider";

export function AnimatedThemeToggler() {
    const { mode, toggleTheme } = useTheme();

    return (
        <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="Toggle theme"
            sx={{
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                    transform: "rotate(180deg)",
                },
            }}
        >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
}