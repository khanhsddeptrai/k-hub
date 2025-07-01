import { useState } from 'react';
import { Avatar, Menu, MenuItem, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo') || '{}');

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar alt={user.name} src={user.avatar}>
                    {user.name?.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => navigate('/admin/profile')}>
                    <Typography>Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <Typography>Logout</Typography>
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;