"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
    AppBar,
    Avatar,
    Box,
    CircularProgress,
    CssBaseline,
    Drawer,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import { clearAccessToken } from "@/features/auth/token";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { LeadSidebar } from "./components/LeadSidebar";
import { LeadPanels } from "./components/LeadPanels";
import { MiniDrawer } from "./components/MiniDrawer";
import { useDashboardPage } from "./useDashboardPage";

export default function DashboardPage({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const { userId } = React.use(params);
    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { isReady, activeSection, setActiveSection, sidebarOpen, setSidebarOpen, onSelectSection, leadState } =
        useDashboardPage(userId);

    const handleToggleSidebar = () => {
        setSidebarOpen((v) => !v);
    };

    const handleSelectSection = (key: typeof activeSection) => {
        onSelectSection(key);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const handleSignOut = () => {
        clearAccessToken();
        router.replace("/login");
        setAnchorEl(null);
    };

    if (!isReady) {
        return (
            <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                    <CircularProgress size={28} />
                    <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                        Checking your session…
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                    color: "text.primary",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{ minHeight: 64 }}>
                    <IconButton
                        onClick={handleToggleSidebar}
                        edge="start"
                        aria-label="Toggle sidebar"
                        sx={{ mr: 1 }}
                    >
                        <MenuOutlinedIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        SalesCRM
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <AnimatedThemeToggler />
                    <Avatar sx={{ bgcolor: 'primary', cursor: 'pointer' }} onClick={(event) => setAnchorEl(event.currentTarget)} />
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
                    Sign Out
                </MenuItem>
            </Menu>

            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: 280,
                            borderRightColor: "divider",
                        },
                    }}
                >
                    <LeadSidebar
                        open
                        onToggleOpen={() => setSidebarOpen(false)}
                        activeKey={activeSection}
                        onSelectKey={handleSelectSection}
                    />
                </Drawer>
            ) : (
                <MiniDrawer
                    variant="permanent"
                    open={sidebarOpen}
                    sx={{ display: { xs: "none", sm: "block" } }}
                >
                    <LeadSidebar
                        open={sidebarOpen}
                        onToggleOpen={handleToggleSidebar}
                        activeKey={activeSection}
                        onSelectKey={handleSelectSection}
                    />
                </MiniDrawer>
            )}

            <Box component="main" sx={{ flex: 1, px: { xs: 2, sm: 3 }, py: 3 }}>
                <Toolbar sx={{ minHeight: 64 }} />
                <Box sx={{ maxWidth: 1100, width: "100%" }}>
                    <LeadPanels
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        leadState={leadState}
                        createdByUserId={userId}
                    />
                </Box>
            </Box>
        </Box>
    );
}
