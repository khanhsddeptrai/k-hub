import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import authorizedAxiosInstance from '../utils/authorizedAxios';
import { useDispatch } from 'react-redux';
import { updateUserRedux } from '../store/slices/userSlice';
import Loading from '../components/ui/Loading';

const FacebookCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

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
                    const res = await authorizedAxiosInstance.post(
                        'http://localhost:8080/api/auth/facebook-login',
                        {
                            email: facebookUser.email,
                            facebookId: facebookUser.id,
                            name: facebookUser.name,
                            picture: facebookUser.picture?.data?.url,
                        }
                    );

                    const loginData = res.data;
                    console.log("facebook user: ", loginData)

                    localStorage.setItem('accessToken', loginData.data.accessToken);
                    localStorage.setItem('refreshToken', loginData.data.refreshToken || '');

                    const userRedux = {
                        id: loginData.data.payload?.id,
                        email: loginData.data.payload?.email,
                        roles: loginData.data.payload?.roles,
                        name: facebookUser.name,
                        avatar: facebookUser.picture?.data?.url,
                        // address: userProfile?.data.address,
                        // phone: userProfile?.data.phone,
                    }

                    dispatch(updateUserRedux({
                        accessToken: loginData.data.accessToken,
                        refreshToken: loginData.data.refreshToken,
                        user: userRedux
                    }))

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

    return <Loading message="Đang xử lý đăng nhập Facebook..." />
};

export default FacebookCallback;