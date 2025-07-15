import React from "react";
// import { toast } from "react-toastify";
import { Avatar, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from "../store";
import { logoutUserRedux } from "../store/slices/userSlice";

interface Profile {
    id?: string;
    name: string;
    phone: string;
    address: string;
    avatar: string;
    dateOfBirth: string;
}

function Profile(): React.ReactElement {
    // const [profile, setProfile] = useState<Profile>()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.userInfo);

    async function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch(logoutUserRedux())
        navigate("/login");
    }

    return (
        <Box sx={{
            borderLeft: '1px solid',
            borderColor: 'divider',
            pl: 2,
            minHeight: '100vh'
        }}>
            <h1>My Profile</h1>
            <strong>Name:</strong> {user?.name} <br />
            <strong>Phone:</strong> {user?.phone} <br />
            <strong>Address:</strong> {user?.address} <br />
            <strong>Birthday:</strong> {user?.dateOfBirth} <br />
            <Button
                type="button"
                variant="contained"
                color="info"
                size="large"
                sx={{ mt: 2, maxWidth: 'min-content', alignSelf: 'flex-end' }}
                onClick={handleLogout}
            >
                Logout
            </Button>
            <Avatar
                alt="User Avatar"
                src={user?.avatar}
                sx={{
                    width: 60,
                    height: 60,
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.3s ease'
                    }
                }}
            />
        </Box>
    )
}

export default Profile;