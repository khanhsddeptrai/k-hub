import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import UserMenu from '../ui/UserMenu';

const Header = () => {
    return (
        <AppBar
            position="fixed"
            sx={{
                width: 'calc(100% - 240px)',
                ml: '240px',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                boxShadow: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Admin Logo
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    <UserMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;