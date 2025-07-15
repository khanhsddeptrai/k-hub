import { useState, useEffect } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, CircularProgress, Alert, Avatar, Chip, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem,
    FormControl, InputLabel,
    Select
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { fetchAuthInfo, fetchAllProfiles } from '../../apis/apis';

interface AuthUser {
    _id: string;
    email: string;
    roles: Array<{
        _id: string;
        name: string;
    }>;
}

interface UserProfile {
    _id: string;
    name?: string;
    phone?: string;
    address?: string;
    avatar?: string;
}

interface MergedUser extends AuthUser, UserProfile { }

const UserManagement = () => {
    const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<MergedUser | null>(null);
    const [dialogType, setDialogType] = useState<'view' | 'edit' | 'delete' | 'add' | null>(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phone: '',
        roleId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [authData, profileData] = await Promise.all([
                    fetchAuthInfo(),
                    fetchAllProfiles()
                ]);
                setAuthUsers(authData);
                setProfiles(profileData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Kết hợp thông tin từ 2 API
    const mergedUsers = authUsers.map(authUser => {
        const profile = profiles.find(p => p._id === authUser._id);
        return {
            ...authUser,
            ...profile
        };
    });

    const handleOpenDialog = (type: 'view' | 'edit' | 'delete' | 'add', user?: MergedUser) => {
        if (type === 'add') {
            setNewUser({ name: '', email: '', phone: '', roleId: '' });
        } else {
            setSelectedUser(user || null);
        }
        setDialogType(type);
    };

    const handleCloseDialog = () => {
        setDialogType(null);
        setSelectedUser(null);
        setNewUser({ name: '', email: '', phone: '', roleId: '' });
    };

    const handleSave = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            // Gọi API update user ở đây
            // await updateUser(selectedUser._id, selectedUser);

            // Sau khi update thành công, refetch data
            const [authData, profileData] = await Promise.all([
                fetchAuthInfo(),
                fetchAllProfiles()
            ]);
            setAuthUsers(authData);
            setProfiles(profileData);

            handleCloseDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async () => {
        try {
            setLoading(true);
            // Gọi API thêm user ở đây
            // await addUser(newUser);

            // Sau khi thêm thành công, refetch data
            const [authData, profileData] = await Promise.all([
                fetchAuthInfo(),
                fetchAllProfiles()
            ]);
            setAuthUsers(authData);
            setProfiles(profileData);

            handleCloseDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Add user failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        try {
            setLoading(true);
            // Gọi API delete user ở đây
            // await deleteUser(selectedUser._id);

            // Sau khi delete thành công, refetch data
            const [authData, profileData] = await Promise.all([
                fetchAuthInfo(),
                fetchAllProfiles()
            ]);
            setAuthUsers(authData);
            setProfiles(profileData);

            handleCloseDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box mt={2}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Quản lý Người dùng
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('add')}
                >
                    Thêm người dùng
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mergedUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <Avatar src={user?.avatar} />
                                </TableCell>
                                <TableCell>{user.name || 'N/A'}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone || 'N/A'}</TableCell>
                                <TableCell>
                                    {user.roles?.map(role => (
                                        <Chip
                                            key={role._id}
                                            label={role.name}
                                            color={
                                                role.name === 'admin' ? 'secondary' :
                                                    role.name === 'user' ? 'primary' :
                                                        'default'
                                            }
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Xem chi tiết">
                                        <IconButton
                                            color="info"
                                            onClick={() => handleOpenDialog('view', user)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Chỉnh sửa">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenDialog('edit', user)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleOpenDialog('delete', user)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog xem chi tiết */}
            <Dialog open={dialogType === 'view'} onClose={handleCloseDialog}>
                <DialogTitle>Thông tin người dùng</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Họ tên"
                                value={selectedUser.name || 'N/A'}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={selectedUser.email}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                value={selectedUser.phone || 'N/A'}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    label="Vai trò"
                                    value={selectedUser.roles?.[0]?.name || ''}
                                    readOnly
                                >
                                    {selectedUser.roles?.map(role => (
                                        <MenuItem key={role._id} value={role.name}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog chỉnh sửa */}
            <Dialog open={dialogType === 'edit'} onClose={handleCloseDialog}>
                <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Họ tên"
                                value={selectedUser.name || ''}
                                onChange={(e) => setSelectedUser({
                                    ...selectedUser,
                                    name: e.target.value
                                })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={selectedUser.email}
                                onChange={(e) => setSelectedUser({
                                    ...selectedUser,
                                    email: e.target.value
                                })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                value={selectedUser.phone || ''}
                                onChange={(e) => setSelectedUser({
                                    ...selectedUser,
                                    phone: e.target.value
                                })}
                                sx={{ mb: 2 }}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    label="Vai trò"
                                    value={selectedUser.roles?.[0]?._id || ''}
                                    onChange={(e) => {
                                        const selectedRole = selectedUser.roles?.find(r => r._id === e.target.value);
                                        if (selectedRole) {
                                            setSelectedUser({
                                                ...selectedUser,
                                                roles: [selectedRole]
                                            });
                                        }
                                    }}
                                >
                                    {authUsers.flatMap(u => u.roles)
                                        .filter((role, index, self) =>
                                            index === self.findIndex(r => r._id === role._id)
                                        )
                                        .map(role => (
                                            <MenuItem key={role._id} value={role._id}>
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog thêm người dùng */}
            <Dialog open={dialogType === 'add'} onClose={handleCloseDialog}>
                <DialogTitle>Thêm người dùng mới</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Họ tên"
                            value={newUser.name}
                            onChange={(e) => setNewUser({
                                ...newUser,
                                name: e.target.value
                            })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({
                                ...newUser,
                                email: e.target.value
                            })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Số điện thoại"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({
                                ...newUser,
                                phone: e.target.value
                            })}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Vai trò</InputLabel>
                            <Select
                                label="Vai trò"
                                value={newUser.roleId}
                                onChange={(e) => setNewUser({
                                    ...newUser,
                                    roleId: e.target.value
                                })}
                            >
                                {authUsers.flatMap(u => u.roles)
                                    .filter((role, index, self) =>
                                        index === self.findIndex(r => r._id === role._id)
                                    )
                                    .map(role => (
                                        <MenuItem key={role._id} value={role._id}>
                                            {role.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button
                        onClick={handleAddUser}
                        variant="contained"
                        disabled={loading || !newUser.name || !newUser.email || !newUser.roleId}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog xóa */}
            <Dialog open={dialogType === 'delete'} onClose={handleCloseDialog}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa người dùng <span style={{ color: '#d32f2f' }}>{selectedUser?.name}?</span>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Xóa'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;