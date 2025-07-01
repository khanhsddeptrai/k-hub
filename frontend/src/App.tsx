import { Container } from '@mui/material';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Home from './pages/Home.tsx';
import Profile from './pages/Profile.tsx';
import NotFound from './pages/NotFound.tsx';
import type { JSX } from 'react';
import GoogleCallback from './pages/GoogleCallback.tsx';
import FacebookCallback from './pages/FacebookCallback.tsx';
import AdminLayout from './components/layout/AdminLayout.tsx';
import UsersPage from './pages/Admin/UserPage.tsx';
// import UserMenu from './components/ui/UserMenu.tsx';

interface UserInfo {
  id: number;
  email: string
}

const ProtectedRoutes = (): JSX.Element => {
  const userInfo = localStorage.getItem('userInfo')
  let user: UserInfo | null = null;
  if (userInfo) {
    try {
      user = JSON.parse(userInfo)
    } catch (error) {
      console.error('Error parsing userInfo:', error);
    }
  }
  if (!user) {
    return <Navigate to='/login' replace={true} />
  }
  return <Outlet />
}

// const UnAuthorizedRoutes = (): JSX.Element => {
//   const userInfo = localStorage.getItem('userInfo')
//   let user: UserInfo | null = null;
//   if (userInfo) {
//     try {
//       user = JSON.parse(userInfo) as UserInfo
//     } catch (error) {
//       console.error('Error parsing userInfo:', error);
//     }
//   }
//   if (user) {
//     return <Navigate to='/' replace={true} />
//   }
//   return <Outlet />
// }

function App() {
  return (
    <Container sx={{ margin: 0, padding: 0 }} disableGutters={true} maxWidth={false}>
      <Routes >
        <Route path='/' element={<Home />} />

        {/* <Route element={<UnAuthorizedRoutes />}>
          
        </Route> */}
        <Route path='/login' element={<Login />} />
        <Route path="/oauth/callback" element={<GoogleCallback />} />
        <Route path="/oauth/facebook/callback" element={<FacebookCallback />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/my-profile' element={<Profile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/users" element={<UsersPage />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </Container>
  );
}

export default App;