import React, { useEffect, useState } from "react";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { toast } from "react-toastify";
import { Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Profile {
    id?: string;
    name: string;
    phone: string;
    address: string;
    avatar: string;
    dateOfBirth: string;
}

interface ProfileDataRespone {
    statusCode: number;
    message: string;
    data: Profile;
}

function Profile(): React.ReactElement {
    const [profile, setProfile] = useState<Profile>()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfileData = async () => {
            let userInfo = localStorage.getItem("userInfo");
            if (!userInfo) {
                toast.error("You need login to view profile!");
            }
            const userId = JSON.parse(userInfo!).id;
            try {
                const res = await authorizedAxiosInstance
                    .get<ProfileDataRespone>(`http://localhost:8082/api/user/profile/${userId}`);
                console.log('Profile Data:', res.data);
                setProfile(res.data.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Không thể lấy danh sách người dùng, vui lòng thử lại.');
            }
        };
        fetchProfileData();
    }, []);

    async function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");
        navigate("/login");
    }

    return (
        <div>
            <h1>My Profile</h1>
            <strong>Name:</strong> {profile?.name} <br />
            <strong>Phone:</strong> {profile?.phone} <br />
            <strong>Address:</strong> {profile?.address} <br />
            <strong>Birthday:</strong> {profile?.dateOfBirth} <br />
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
                src={profile?.avatar}
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
        </div>
    )
}

export default Profile;