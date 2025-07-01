import { useForm, type SubmitHandler } from 'react-hook-form';
import { Box, Button, TextField, Alert, Typography, Card as MuiCard, CardActions, Zoom } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import authorizedAxiosInstance from '../utils/authorizedAxios';
import { toast } from 'react-toastify';
import type React from 'react';

interface LoginFormInputs {
    email: string;
    password: string;
}

export interface LoginResponse {
    statusCode: number;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        payload?: {
            userId: number;
            email: string;
        }
    }
}

const getOAthGoogleUrl = () => {
    const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_AUTHORIZED_REDIRECT_URI } = import.meta.env;
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem('oauth_google_state', state);
    const options = {
        redirect_uri: VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
        client_id: VITE_GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(' '),
        state,
    };
    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
}

const getFacebookOAuthUrl = () => {
    const { VITE_FACEBOOK_CLIENT_ID, VITE_FACEBOOK_REDIRECT_URI } = import.meta.env;
    const state = Math.random().toString(36).substring(2);
    localStorage.setItem('oauth_facebook_state', state); // Lưu state để chống CSRF
    const options = {
        client_id: VITE_FACEBOOK_CLIENT_ID,
        redirect_uri: VITE_FACEBOOK_REDIRECT_URI,
        scope: 'email,public_profile', // Quyền truy cập
        response_type: 'code',
        state, // Thêm state
    };
    const qs = new URLSearchParams(options);
    return `https://www.facebook.com/v18.0/dialog/oauth?${qs.toString()}`;
};




function LoginForm(): React.ReactElement {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        const normalizedInput = {
            ...data,
            email: data.email.toLowerCase().trim(),
        };
        const res = await authorizedAxiosInstance.post<LoginResponse>(`http://localhost:8080/api/auth/login`, normalizedInput);
        console.log("check res user: ", res);
        const loginData = res.data;
        localStorage.setItem('accessToken', loginData.data.accessToken);
        localStorage.setItem('refreshToken', loginData.data.refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(loginData.data.payload));
        toast.success(loginData.message);
        navigate('/my-profile');
        console.log('Response:', loginData);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: 'url("/src/assets/backgroundLogin.jpg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)',
        }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                    <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em', p: '0.5em 0', borderRadius: 2 }}>
                        <Box sx={{ padding: '0 1em 1em 1em' }}>
                            <Typography variant="h5" sx={{ textAlign: 'center', mb: '1em' }}>
                                Đăng Nhập
                            </Typography>
                            <Box sx={{ marginTop: '1.2em' }}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    label="Email"
                                    type="text"
                                    variant="outlined"
                                    error={!!errors.email}
                                    {...register('email', {
                                        required: 'Email là bắt buộc',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: 'Email không hợp lệ',
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <Alert severity="error" sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                                        {errors.email.message}
                                    </Alert>
                                )}
                            </Box>
                            <Box sx={{ marginTop: '1em' }}>
                                <TextField
                                    fullWidth
                                    label="Mật khẩu"
                                    type="password"
                                    variant="outlined"
                                    error={!!errors.password}
                                    {...register('password', {
                                        required: 'Mật khẩu là bắt buộc',
                                        minLength: {
                                            value: 6,
                                            message: 'Mật khẩu phải có ít nhất 6 ký tự',
                                        },
                                    })}
                                />
                                {errors.password && (
                                    <Alert severity="error" sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
                                        {errors.password.message}
                                    </Alert>
                                )}
                            </Box>
                        </Box>
                        <CardActions sx={{ padding: '0.5em 1em 1em 1em' }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                            >
                                Đăng Nhập
                            </Button>
                            <div style={{
                                display: 'flex',
                                gap: '0.5em',
                                marginTop: '10px',
                                marginRight: "9px"
                            }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    sx={{ flex: 1 }}
                                    style={{ padding: '10px 20px', width: '210px' }}
                                    onClick={() => window.location.href = getOAthGoogleUrl()}
                                >
                                    GOOGLE
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                    sx={{ flex: 1 }}
                                    onClick={() => window.location.href = getFacebookOAuthUrl()}
                                >
                                    <Link to="">FACEBOOK</Link>
                                </Button>
                            </div>
                        </CardActions>
                        <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
                            <Typography>
                                Chưa có tài khoản?{' '}
                                <Button component={Link} to="/register">
                                    Đăng Ký
                                </Button>
                            </Typography>
                        </Box>
                    </MuiCard>
                </Zoom>
            </form>
        </Box>
    );
}

export default LoginForm;




{/* <script>
    window.fbAsyncInit = function() {
        FB.init({
            appId: '{your-app-id}',
            cookie: true,
            xfbml: true,
            version: '{api-version}'
        });

    FB.AppEvents.logPageView();   
      
  };

    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script> */}