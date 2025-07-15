import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, useTheme } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as UsersIcon,
    Article as PostsIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
    const theme = useTheme();

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Users', icon: <UsersIcon />, path: '/admin/users' },
        { text: 'Posts', icon: <PostsIcon />, path: '/admin/posts' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/' }
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
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText
                }
            }}
        >
            <Toolbar /> {/* Spacer for header */}
            <List sx={{ padding: 0 }}>
                {navItems.map((item) => (
                    <ListItem
                        key={item.text}
                        component={NavLink}
                        to={item.path}
                        end={item.path === '/admin'} // Chỉ áp dụng end cho Dashboard
                        style={{ color: 'white' }}
                        sx={{
                            '&.active': {
                                backgroundColor: theme.palette.action.selected,
                                '& .MuiListItemIcon-root': {
                                    color: theme.palette.secondary.main
                                }
                            },
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover
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

export default AdminSidebar;