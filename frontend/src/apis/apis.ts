import axios from 'axios';

const AUTH_API_URL = 'http://localhost:8080/api';
const USER_API_URL = 'http://localhost:8082/api';


export const fetchAuthInfo = async () => {
    const response = await axios.get(`${AUTH_API_URL}/auth/get-all-info`);
    return response.data.data; // Trả về mảng users
};

export const fetchAllProfiles = async () => {
    const response = await axios.get(`${USER_API_URL}/user/profile/get-all`);
    return response.data.data; // Trả về mảng profiles
};