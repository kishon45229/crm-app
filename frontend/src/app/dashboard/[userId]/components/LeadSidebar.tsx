import * as React from "react";

import {
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

export type DashboardSectionKey =
    | "home"
    | "create"
    | "view";

export type SidebarItem = {
    key: DashboardSectionKey;
    label: string;
    helper: string;
    icon: React.ReactNode;
};

export const sidebarItems: SidebarItem[] = [
    {
        key: "home",
        label: "Home",
        helper: "Overview of your lead pipeline.",
        icon: <HomeOutlinedIcon fontSize="small" />,
    },
    {
        key: "create",
        label: "Create leads",
        helper: "Add a new lead to your pipeline.",
        icon: <AddOutlinedIcon fontSize="small" />,
    },
    {
        key: "view",
        label: "View leads",
        helper: "Browse existing leads.",
        icon: <ListAltOutlinedIcon fontSize="small" />,
    },
];

export type LeadSidebarProps = {
    open: boolean;
    onToggleOpen: () => void;
    activeKey: DashboardSectionKey;
    onSelectKey: (key: DashboardSectionKey) => void;
};

export function LeadSidebar({
    open,
    onToggleOpen,
    activeKey,
    onSelectKey,
}: LeadSidebarProps) {
    return (
        <>
            <Toolbar
                sx={{
                    minHeight: 64,
                    px: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: open ? "space-between" : "center",
                }}
            >
                {open ? (
                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                        Lead Management
                    </Typography>
                ) : null}

                <Tooltip title={open ? "Collapse" : "Expand"} placement="right">
                    <IconButton onClick={onToggleOpen} size="small" aria-label="Toggle sidebar">
                        {open ? (
                            <ChevronLeftOutlinedIcon fontSize="small" />
                        ) : (
                            <ChevronRightOutlinedIcon fontSize="small" />
                        )}
                    </IconButton>
                </Tooltip>
            </Toolbar>

            <Divider />

            <List sx={{ px: 1, py: 1 }}>
                {sidebarItems.map((item) => {
                    const selected = item.key === activeKey;
                    const button = (
                        <ListItemButton
                            key={item.key}
                            selected={selected}
                            onClick={() => onSelectKey(item.key)}
                            sx={{
                                borderRadius: 1,
                                my: 0.5,
                                justifyContent: open ? "initial" : "center",
                                px: open ? 1.5 : 1,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 1.5 : 0,
                                    justifyContent: "center",
                                    color: "inherit",
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                sx={{
                                    opacity: open ? 1 : 0,
                                    "& .MuiListItemText-primary": {
                                        fontSize: "0.875rem",
                                        fontWeight: selected ? 700 : 500,
                                    },
                                }}
                            />
                        </ListItemButton>
                    );

                    return open ? (
                        button
                    ) : (
                        <Tooltip key={item.key} title={item.label} placement="right">
                            {button}
                        </Tooltip>
                    );
                })}
            </List>
        </>
    );
}
