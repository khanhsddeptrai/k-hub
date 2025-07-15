
import {
    Box,
    Avatar,
    Typography,
    Button,
    Divider,
    IconButton,
    Paper,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    Modal,
    ImageList,
    ImageListItem,
} from '@mui/material';
import {
    LiveTv,
    PhotoCamera,
    Videocam,
    Mood,
    ThumbUp,
    ChatBubble,
    Share,
    MoreHoriz,
    Close,
    ArrowBackIos,
    ArrowForwardIos,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from 'axios';
import { toast } from 'react-toastify';
import authorizedAxiosInstance from '../utils/authorizedAxios';
import { type RootState } from '../store';
import Loading from '../components/ui/Loading';

// Interface definitions
interface User {
    name: string;
    avatar: string;
    _id: string;
}

interface PostImage {
    url: string;
    alt: string;
}

interface Post {
    user: User;
    time?: string;
    content: string;
    images?: PostImage[];
    likes: string;
    comments: string;
    shares: string;
}

interface Friend {
    name: string;
    online: boolean;
}

const Home = () => {
    const [selectedImage, setSelectedImage] = useState<PostImage | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentPostIndex, setCurrentPostIndex] = useState(0);
    const [openPostDialog, setOpenPostDialog] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPosting, setIsPosting] = useState(false); // State để theo dõi trạng thái đăng bài

    const user = useSelector((state: RootState) => state.user.userInfo);
    console.log('check user from home: ', user);

    // Active Friends (giữ nguyên dữ liệu giả)
    const activeFriends: Friend[] = [
        { name: 'Jaden Chance', online: true },
        { name: 'Arezki Williams', online: true },
        { name: 'Rose James', online: true },
        { name: 'Tman Mats', online: false },
        { name: 'Alex Andrew', online: true },
        { name: 'Kaixi Cark', online: true },
        { name: 'Hamid Oskip', online: false },
        { name: 'Serena Lewis', online: true },
        { name: 'April Sky', online: true },
    ];

    // Gọi API để lấy bài viết
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8084/api/post/get-all', {
                    params: {
                        limit: 20,
                        skip: 0,
                    },
                });

                const apiPosts = response.data.data || [];

                // Ánh xạ dữ liệu từ API sang interface Post
                const formattedPosts: Post[] = apiPosts.map((post: any) => ({
                    user: {
                        _id: post.author._id,
                        name: post.author.name || 'Unknown',
                        avatar: post.author.avatar || '',
                    },
                    time: formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                        locale: vi,
                    }),
                    content: post.content || '',
                    images: post.media
                        ? post.media.map((url: string, index: number) => ({
                            url,
                            alt: `Hình ảnh ${index + 1}`,
                        }))
                        : [],
                    likes: '0',
                    comments: '0',
                    shares: '0',
                }));

                setPosts(formattedPosts);
                setError(null);
            } catch (error) {
                console.error('Lỗi khi lấy bài viết:', error);
                setError('Không thể tải bài viết. Vui lòng thử lại sau.');
            }
        };

        fetchPosts();
    }, []);

    // Image handling functions
    const handleImageClick = (img: PostImage, postIndex: number, imgIndex: number) => {
        setSelectedImage(img);
        setCurrentImageIndex(imgIndex);
        setCurrentPostIndex(postIndex);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const navigateImages = (direction: 'prev' | 'next') => {
        const currentPost = posts[currentPostIndex];
        if (!currentPost.images) return;

        let newIndex = currentImageIndex;
        if (direction === 'prev') {
            newIndex = (currentImageIndex - 1 + currentPost.images.length) % currentPost.images.length;
        } else {
            newIndex = (currentImageIndex + 1) % currentPost.images.length;
        }

        setCurrentImageIndex(newIndex);
        setSelectedImage(currentPost.images[newIndex]);
    };

    // Post dialog functions
    const handleOpenPostDialog = () => {
        setOpenPostDialog(true);
    };

    const handleClosePostDialog = () => {
        setOpenPostDialog(false);
        setPostContent('');
        setSelectedFiles([]);
        setPreviewImages([]);
        setIsPosting(false); // Reset trạng thái loading
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).slice(0, 5 - selectedFiles.length);
            const updatedFiles = [...selectedFiles, ...newFiles].slice(0, 5);
            setSelectedFiles(updatedFiles);

            const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
            const updatedPreviewImages = [...previewImages, ...newPreviewUrls].slice(0, 5);
            setPreviewImages(updatedPreviewImages);
        }
    };

    const handleRemoveImage = (index: number) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handlePostSubmit = async () => {
        if (postContent.trim() || selectedFiles.length > 0) {
            setIsPosting(true); // Bật trạng thái loading
            const formData = new FormData();
            formData.append('authorId', user!.id);
            formData.append('content', postContent);
            selectedFiles.forEach(file => formData.append('media', file));

            try {
                const response = await authorizedAxiosInstance.post('http://localhost:8084/api/post/create', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log('Bài viết đã tạo:', response.data);
                toast.success('Đăng bài thành công!');

                // Gọi lại API để làm mới danh sách bài viết
                const fetchResponse = await axios.get('http://localhost:8084/api/post/get-all', {
                    params: { limit: 20, skip: 0 },
                });
                const newPosts = fetchResponse.data.data.map((post: any) => ({
                    user: {
                        _id: post.author._id,
                        name: post.author.name || 'Unknown',
                        avatar: post.author.avatar || '',
                    },
                    time: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi }),
                    content: post.content || '',
                    images: post.media
                        ? post.media.map((url: string, index: number) => ({
                            url,
                            alt: `Hình ảnh ${index + 1}`,
                        }))
                        : [],
                    likes: '0',
                    comments: '0',
                    shares: '0',
                }));
                setPosts(newPosts);
                handleClosePostDialog();
            } catch (error) {
                console.error('Lỗi khi tạo bài viết:', error);
                toast.error('Lỗi khi đăng bài. Vui lòng thử lại.');
                setIsPosting(false); // Tắt trạng thái loading nếu có lỗi
            }
        }
    };

    // Render function for image gallery
    const renderImageGallery = (post: Post, postIndex: number) => {
        if (!post.images || post.images.length === 0) return null;

        const showMoreIndicator = post.images.length > 4;
        const imagesToShow = showMoreIndicator ? post.images.slice(0, 4) : post.images;

        return (
            <Box sx={{ mb: 2, position: 'relative' }}>
                <ImageList cols={imagesToShow.length > 1 ? 2 : 1} gap={8} sx={{ borderRadius: 1, overflow: 'hidden', margin: 0 }}>
                    {imagesToShow.map((img, imgIndex) => (
                        <ImageListItem key={`post-${postIndex}-img-${imgIndex}`} sx={{ position: 'relative', cursor: 'pointer' }}>
                            <img
                                src={img.url}
                                alt={img.alt}
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    aspectRatio: '1/1',
                                    filter: showMoreIndicator && imgIndex === 3 ? 'brightness(0.7)' : 'none',
                                }}
                                onClick={() => {
                                    if (showMoreIndicator && imgIndex === 3) {
                                        if (post.images && post.images.length > 0) {
                                            handleImageClick(post.images[0], postIndex, 0);
                                        }
                                    } else {
                                        handleImageClick(img, postIndex, imgIndex);
                                    }
                                }}
                            />
                            {showMoreIndicator && imgIndex === 3 && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        color: 'white',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    +{post.images!.length - 4}
                                </Box>
                            )}
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', maxWidth: 950, mx: 'auto', py: 2, gap: 3 }}>
            {/* Main Content - Posts */}
            <Box sx={{ flex: 2.5 }}>
                {/* Create Post Card */}
                <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar alt={user?.name} src={user?.avatar}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <TextField
                            fullWidth
                            placeholder="Bạn đang nghĩ gì?"
                            variant="outlined"
                            size="small"
                            onClick={handleOpenPostDialog}
                        />
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button startIcon={<LiveTv color="error" />}>Live</Button>
                        <Button startIcon={<PhotoCamera color="primary" />}>Ảnh</Button>
                        <Button startIcon={<Videocam color="success" />}>Video</Button>
                        <Button startIcon={<Mood color="warning" />}>Cảm xúc</Button>
                    </Box>
                </Paper>

                {/* Hiển thị lỗi nếu có */}
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {/* Posts List */}
                {posts.length === 0 && !error ? (
                    <Loading message="Đang tải bài viết..." />
                ) : (
                    posts.map((post, postIndex) => (
                        <Paper key={`post-${postIndex}`} elevation={3} sx={{ p: 2, mb: 3 }}>
                            {/* Post Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar src={post.user.avatar} />
                                <Box>
                                    <Typography fontWeight="bold">{post.user.name}</Typography>
                                    {post.time && (
                                        <Typography variant="caption" color="text.secondary">
                                            {post.time}
                                        </Typography>
                                    )}
                                </Box>
                                <IconButton sx={{ ml: 'auto' }}>
                                    <MoreHoriz />
                                </IconButton>
                            </Box>

                            {/* Post Content */}
                            <Typography sx={{ mb: 2 }}>{post.content}</Typography>

                            {/* Image Gallery */}
                            {renderImageGallery(post, postIndex)}

                            {/* Post Actions */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {post.likes} lượt thích · {post.comments} bình luận · {post.shares} lượt chia sẻ
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button startIcon={<ThumbUp />} fullWidth>
                                    Thích
                                </Button>
                                <Button startIcon={<ChatBubble />} fullWidth>
                                    Bình luận
                                </Button>
                                <Button startIcon={<Share />} fullWidth>
                                    Chia sẻ
                                </Button>
                            </Box>
                        </Paper>
                    ))
                )}

                {/* Post Dialog */}
                <Dialog
                    open={openPostDialog}
                    onClose={handleClosePostDialog}
                    sx={{ '& .MuiDialog-paper': { width: '500px', maxHeight: '600px' } }}
                >
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Tạo bài viết</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Bạn đang nghĩ gì?"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            value={postContent}
                            onChange={e => setPostContent(e.target.value)}
                            variant="outlined"
                            disabled={isPosting} // Vô hiệu hóa khi đang đăng
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<PhotoCamera />}
                            sx={{ mt: 2 }}
                            disabled={isPosting} // Vô hiệu hóa khi đang đăng
                        >
                            Thêm ảnh
                            <input type="file" hidden accept="image/*" multiple onChange={handleFileChange} />
                        </Button>
                        {previewImages.length > 0 && (
                            <ImageList cols={2} gap={8} sx={{ mt: 2 }}>
                                {previewImages.map((preview, index) => (
                                    <ImageListItem key={index} sx={{ position: 'relative' }}>
                                        <img
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveImage(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                color: 'white',
                                                bgcolor: 'rgba(0,0,0,0.5)',
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                            }}
                                            disabled={isPosting} // Vô hiệu hóa khi đang đăng
                                        >
                                            <Close />
                                        </IconButton>
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePostDialog} disabled={isPosting}>
                            Hủy
                        </Button>
                        <Button onClick={handlePostSubmit} variant="contained" disabled={isPosting}>
                            Đăng
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Loading Modal */}
                <Modal
                    open={isPosting}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}
                >
                    <Box sx={{ outline: 'none' }}>
                        <Loading message="Đang đăng bài viết..." />
                    </Box>
                </Modal>
            </Box>

            {/* Active Friends Sidebar */}
            <Box sx={{ flex: 1, maxWidth: 300 }}>
                <Paper elevation={3} sx={{ p: 2, position: 'sticky', top: 20 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Bạn bè đang hoạt động
                    </Typography>
                    <List>
                        {activeFriends.map((friend, index) => (
                            <ListItem key={`friend-${index}`} sx={{ px: 0, cursor: 'pointer' }}>
                                <ListItemAvatar>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color={friend.online ? 'success' : 'default'}
                                    >
                                        <Avatar />
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText primary={friend.name} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>

            {/* Image Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        outline: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1 }}
                    >
                        <Close />
                    </IconButton>
                    {selectedImage && posts[currentPostIndex].images && posts[currentPostIndex].images!.length > 1 && (
                        <>
                            <IconButton
                                onClick={() => navigateImages('prev')}
                                sx={{ position: 'absolute', left: 8, top: '50%', color: 'white', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1 }}
                            >
                                <ArrowBackIos />
                            </IconButton>
                            <IconButton
                                onClick={() => navigateImages('next')}
                                sx={{ position: 'absolute', right: 8, top: '50%', color: 'white', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1 }}
                            >
                                <ArrowForwardIos />
                            </IconButton>
                        </>
                    )}
                    {selectedImage && (
                        <img src={selectedImage.url} alt={selectedImage.alt} style={{ maxWidth: '100%', maxHeight: '90vh', display: 'block' }} />
                    )}
                    {selectedImage && posts[currentPostIndex].images && posts[currentPostIndex].images!.length > 1 && (
                        <Typography
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: 'white',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                px: 2,
                                borderRadius: 2,
                            }}
                        >
                            {currentImageIndex + 1} / {posts[currentPostIndex].images!.length}
                        </Typography>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default Home;
