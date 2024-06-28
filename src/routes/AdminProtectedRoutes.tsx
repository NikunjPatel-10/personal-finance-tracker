import { Navigate } from 'react-router-dom';
import { PftRoutes } from '../core/utility/enums/core.enum';
import Admin from '../pages/admin/Admin';

export default function AdminProtectedRoutes() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token && role === 'Admin') {
    return <Admin />;
  } else if (token && role === 'Employee') {
    return <Navigate to="/unauthorize" />;
  } else {
    return <Navigate to={PftRoutes.SIGNUP} />;
  }
}
