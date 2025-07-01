import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';
import authorizedAxiosInstance from '../utils/authorizedAxios';
import type { LoginResponse } from './Login';

const FacebookCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const error = urlParams.get('error');
            const storedState = localStorage.getItem('oauth_facebook_state');
            localStorage.removeItem('oauth_facebook_state');

            if (error) {
                toast.error('Đăng nhập Facebook thất bại: ' + error);
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
                    const tokenResponse = await authorizedAxiosInstance.post(
                        'http://localhost:8080/api/auth/facebook-token',
                        {
                            code,
                            redirect_uri: import.meta.env.VITE_FACEBOOK_REDIRECT_URI,
                        }
                    );

                    const { access_token } = tokenResponse.data;

                    // Lấy thông tin người dùng từ Facebook
                    const userInfoResponse = await axios.get(
                        'https://graph.facebook.com/v18.0/me',
                        {
                            params: {
                                fields: 'id,email,name,picture',
                                access_token,
                            },
                        }
                    );

                    const facebookUser = userInfoResponse.data;

                    // Gửi thông tin đến backend để đăng nhập
                    const res = await authorizedAxiosInstance.post<LoginResponse>(
                        'http://localhost:8080/api/auth/facebook-login',
                        {
                            email: facebookUser.email,
                            facebookId: facebookUser.id,
                            name: facebookUser.name,
                            picture: facebookUser.picture?.data?.url,
                        }
                    );

                    const loginData = res.data;
                    localStorage.setItem('accessToken', loginData.data.accessToken);
                    localStorage.setItem('refreshToken', loginData.data.refreshToken || '');
                    localStorage.setItem('userInfo', JSON.stringify(loginData.data.payload));
                    toast.success(loginData.message);
                    navigate('/my-profile');
                } catch (error) {
                    console.error('Error during Facebook login:', error);
                    toast.error('Đăng nhập Facebook thất bại');
                    navigate('/login');
                }
            }
        };

        handleCallback();
    }, [navigate, location]);

    return <Box>Đang xử lý đăng nhập...</Box>;
};

export default FacebookCallback;