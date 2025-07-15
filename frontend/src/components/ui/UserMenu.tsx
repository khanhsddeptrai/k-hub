import { useState } from 'react';
import { Avatar, Menu, MenuItem, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

const UserMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user.userInfo);

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
                <Avatar
                    alt={user?.name}
                    src={user?.avatar}
                >
                    {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom', // Menu xuất hiện dưới Avatar
                    horizontal: 'right', // Căn phải với Avatar
                }}
                transformOrigin={{
                    vertical: 'top', // Điểm gốc của menu là phía trên
                    horizontal: 'right', // Căn phải
                }}
                sx={{
                    marginTop: '5px',
                    '& .MuiPaper-root': {
                        minWidth: 200, // Chiều rộng menu
                        padding: '8px', // Padding cho menu
                        transform: 'translateX(10px) !important', // Dịch sang trái 10px
                    },
                }}
            >
                <MenuItem
                    onClick={() => navigate('/my-profile')}
                    sx={{ padding: '12px 16px' }} // Padding đồng nhất
                >
                    <Typography>Profile</Typography>
                </MenuItem>
                <MenuItem
                    onClick={handleLogout}
                    sx={{ padding: '12px 16px' }} // Padding đồng nhất
                >
                    <Typography>Logout</Typography>
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;