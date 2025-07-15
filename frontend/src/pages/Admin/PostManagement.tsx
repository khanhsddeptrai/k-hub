import { useState, useEffect } from 'react';
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, CircularProgress, Alert, Avatar, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
// import { fetchAllPosts, fetchAllUsers } from '../../apis/apis';

interface Post {
    _id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
}

interface User {
    _id: string;
    name?: string;
    email: string;
}

interface MergedPost extends Post {
    authorName?: string;
    authorEmail: string;
}

const PostManagement = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPost, setSelectedPost] = useState<MergedPost | null>(null);
    const [dialogType, setDialogType] = useState<'view' | 'edit' | 'delete' | null>(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true);
    //             const [postData, userData] = await Promise.all([
    //                 fetchAllPosts(),
    //                 fetchAllUsers()
    //             ]);
    //             setPosts(postData);
    //             setUsers(userData);
    //         } catch (err) {
    //             setError(err instanceof Error ? err.message : 'Unknown error');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // Kết hợp thông tin bài viết và tác giả
    const mergedPosts = posts.map(post => {
        const author = users.find(u => u._id === post.authorId);
        return {
            ...post,
            authorName: author?.name || 'N/A',
            authorEmail: author?.email || 'N/A'
        };
    });

    // Cắt ngắn nội dung bài viết để hiển thị
    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const handleOpenDialog = (type: 'view' | 'edit' | 'delete', post: MergedPost) => {
        setSelectedPost(post);
        setDialogType(type);
    };

    const handleCloseDialog = () => {
        setDialogType(null);
        setSelectedPost(null);
    };

    const handleSave = async () => {
        if (!selectedPost) return;

        try {
            // setLoading(true);
            // Gọi API update post ở đây
            // await updatePost(selectedPost._id, selectedPost);

            // Refetch data sau khi update
            // const [postData, userData] = await Promise.all([
            //     fetchAllPosts(),
            //     fetchAllUsers()
            // ]);
            // setPosts(postData);
            // setUsers(userData);

            handleCloseDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
        } finally {
            // setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPost) return;

        try {
            setLoading(true);
            // Gọi API delete post ở đây
            // await deletePost(selectedPost._id);

            // Refetch data sau khi xóa
            // const [postData, userData] = await Promise.all([
            //     fetchAllPosts(),
            //     fetchAllUsers()
            // ]);
            // setPosts(postData);
            // setUsers(userData);

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
            <Typography variant="h4" gutterBottom>
                Quản lý Bài viết
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Tác giả</TableCell>
                            <TableCell>Nội dung</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mergedPosts.map((post) => (
                            <TableRow key={post._id}>
                                <TableCell>{truncateContent(post.content)}</TableCell>
                                <TableCell>{post.authorName || post.authorEmail}</TableCell>
                                <TableCell>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Xem chi tiết">
                                        <IconButton
                                            color="info"
                                            onClick={() => handleOpenDialog('view', post)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Chỉnh sửa">
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpenDialog('edit', post)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                        <IconButton
                                            color="error"
                                            onClick={() => handleOpenDialog('delete', post)}
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
                <DialogTitle>Chi tiết bài viết</DialogTitle>
                <DialogContent>
                    {selectedPost && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Tiêu đề"
                                value={selectedPost.title}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Nội dung"
                                value={selectedPost.content}
                                multiline
                                rows={4}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Tác giả"
                                value={selectedPost.authorName || selectedPost.authorEmail}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Ngày tạo"
                                value={new Date(selectedPost.createdAt).toLocaleDateString('vi-VN')}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog chỉnh sửa */}
            <Dialog open={dialogType === 'edit'} onClose={handleCloseDialog}>
                <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                <DialogContent>
                    {selectedPost && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Tiêu đề"
                                value={selectedPost.title}
                                onChange={(e) => setSelectedPost({
                                    ...selectedPost,
                                    title: e.target.value
                                })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Nội dung"
                                value={selectedPost.content}
                                onChange={(e) => setSelectedPost({
                                    ...selectedPost,
                                    content: e.target.value
                                })}
                                multiline
                                rows={4}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Tác giả"
                                value={selectedPost.authorName || selectedPost.authorEmail}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
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

            {/* Dialog xóa */}
            <Dialog open={dialogType === 'delete'} onClose={handleCloseDialog}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa bài viết <span style={{ color: '#d32f2f' }}>{selectedPost?.title}?</span>
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

export default PostManagement;