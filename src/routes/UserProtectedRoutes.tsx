import { Navigate, Outlet } from 'react-router-dom';

interface IProps {
  role: string;
  token: string;
}

export default function UserProtectedRoutes({ role, token }: IProps) {
  if (token && role === 'Admin') {
    return <Navigate to="/unauthorize" />;
  }
  return <Outlet />;
}
