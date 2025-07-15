import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
    message?: string; // Thông điệp tùy chỉnh
}

const Loading = ({ message = 'Đang tải...' }: LoadingProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.05)', // Nền mờ nhẹ
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
            }}
        >
            <CircularProgress
                size={60}
                thickness={4}
                sx={{
                    color: 'primary.main',
                    mb: 2,
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                    },
                }}
            />
            <Typography
                variant="h6"
                color="text.primary"
                sx={{
                    fontWeight: 'medium',
                    textAlign: 'center',
                    maxWidth: '80%',
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default Loading;
