import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import UserSidebar from './UserSidebar';

const UserLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header width="100%" />
            <UserSidebar />
            <Box
                component="main"
                sx={{
                    pl: 2,
                    pt: 0.5,
                    width: 'calc(100% - 220px)',
                    minHeight: '100vh',
                    backgroundColor: '#f5f5f5'
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default UserLayout;