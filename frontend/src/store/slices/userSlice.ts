import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UserPayload {
    id: string;
    email: string;
    roles: string[];
    name?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    avatar?: string
}

interface UserState {
    accessToken: string | null;
    refreshToken: string | null;
    userInfo: UserPayload | null;
}

const initialState: UserState = {
    accessToken: null,
    refreshToken: null,
    userInfo: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserRedux: (
            state,
            action: PayloadAction<{
                accessToken: string;
                refreshToken: string;
                user: UserPayload;
            }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.userInfo = action.payload.user;
        }
        ,
        logoutUserRedux: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.userInfo = null;
        },
    },
});

export const { updateUserRedux, logoutUserRedux } = userSlice.actions;
export default userSlice.reducer;