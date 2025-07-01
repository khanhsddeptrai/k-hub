import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import authorizedAxiosInstance from '../utils/authorizedAxios';
import type { LoginResponse } from './Login';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const error = urlParams.get('error');
            const storedState = localStorage.getItem('oauth_google_state');
            localStorage.removeItem('oauth_google_state');

            if (error) {
                toast.error('Đăng nhập Google thất bại: ' + error);
                navigate('/login');
                return;
            }

            if (state !== storedState) {
                toast.error('Invalid state parameter');
                navigate('/login');
                return;
            }

            if (code) {
                try {
                    // Gửi code đến backend để đổi lấy access_token
                    const tokenResponse = await authorizedAxiosInstance.post('http://localhost:8080/api/auth/google-token', {
                        code,
                        redirect_uri: import.meta.env.VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
                    });

                    const { access_token, id_token } = tokenResponse.data;

                    // Lấy thông tin người dùng từ Google
                    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
                        params: { access_token, alt: 'json' },
                        headers: { Authorization: `Bearer ${id_token}` },
                    });

                    const googleUser = userInfoResponse.data;

                    // Gửi thông tin đến backend để đăng nhập
                    const res = await authorizedAxiosInstance.post<LoginResponse>(
                        'http://localhost:8080/api/auth/google-login',
                        {
                            email: googleUser.email,
                            googleId: googleUser.id,
                            name: googleUser.name,
                            picture: googleUser.picture,
                        }
                    );

                    const loginData = res.data;
                    localStorage.setItem('accessToken', loginData.data.accessToken);
                    localStorage.setItem('refreshToken', loginData.data.refreshToken || '');
                    localStorage.setItem('userInfo', JSON.stringify(loginData.data.payload));
                    toast.success(loginData.message);
                    navigate('/my-profile');
                } catch (error) {
                    console.error('Error during Google login:', error);
                    toast.error('Đăng nhập Google thất bại');
                    navigate('/login');
                }
            }
        };

        handleCallback();
    }, [navigate, location]);

    return <Box>Đang xử lý đăng nhập...</Box>;
};

export default GoogleCallback;