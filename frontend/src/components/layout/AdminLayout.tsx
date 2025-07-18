import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header width="calc(100% - 220px)" />
            <AdminSidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: 'calc(100% - 240px)',
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

export default AdminLayout;