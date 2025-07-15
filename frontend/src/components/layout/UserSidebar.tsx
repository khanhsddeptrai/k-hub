import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, useTheme } from '@mui/material';
import {
    Home as HomeIcon,
    Person as ProfileIcon,
    Chat as MessagesIcon,
    PhotoLibrary as PhotosIcon,
    Event as EventsIcon
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const UserSidebar = () => {
    const theme = useTheme();

    const navItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Profile', icon: <ProfileIcon />, path: '/my-profile' },
        { text: 'Messages', icon: <MessagesIcon />, path: '/messages' },
        { text: 'Photos', icon: <PhotosIcon />, path: '/user/photos' },
        { text: 'Events', icon: <EventsIcon />, path: '/user/events' }
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 220,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 220,
                    boxSizing: 'border-box',
                    backgroundColor: '#f5f5f5', // White background
                    color: '#000000', // Black text
                    borderRight: 'none',
                    pl: 3, // Padding-left 24px
                }
            }}
        >
            <Toolbar /> {/* Spacer for header */}
            <List sx={{ p: 0 }}>
                {navItems.map((item) => (
                    <ListItem
                        key={item.text}
                        component={NavLink}
                        to={item.path}
                        end={item.path === '/user'} // Chỉ áp dụng end cho Home
                        sx={{
                            m: 0,
                            color: '#000000', // Black text for items
                            '&.active': {
                                color: theme.palette.primary.main, // Màu primary.main cho ListItem
                                '& .MuiListItemIcon-root': {
                                    color: theme.palette.primary.main, // Màu primary.main cho icon
                                },
                                '& .MuiListItemText-root': {
                                    color: theme.palette.primary.main, // Màu primary.main cho text
                                }
                            },
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                marginLeft: -3, // Bù padding-left 24px của MuiDrawer-paper
                                width: 'calc(100% + 24px)', // Mở rộng chiều rộng
                                '& .MuiListItemIcon-root': {
                                    pl: 3, // Giữ icon căn chỉnh đúng
                                },
                                '& .MuiListItemText-root': {
                                    pl: 3, // Giữ text căn chỉnh đúng
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default UserSidebar;