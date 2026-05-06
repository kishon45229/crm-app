"use client";

import { Drawer } from "@mui/material";
import { styled } from "@mui/material/styles";

const drawerWidth = 280;

const openedMixin = (theme: import("@mui/material/styles").Theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden" as const,
});

const closedMixin = (theme: import("@mui/material/styles").Theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden" as const,
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

export const MiniDrawer = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open
        ? {
            ...openedMixin(theme),
            "& .MuiDrawer-paper": {
                ...openedMixin(theme),
                borderRightColor: theme.palette.divider,
            },
        }
        : {
            ...closedMixin(theme),
            "& .MuiDrawer-paper": {
                ...closedMixin(theme),
                borderRightColor: theme.palette.divider,
            },
        }),
}));
