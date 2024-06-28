import { Navigate } from 'react-router-dom';
import UserProtectedRoutes from './routes/UserProtectedRoutes';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/sign-up" />;
  }

  if (role === 'Admin') {
    return <Navigate to="/admin" />;
  }

  if (role === 'Employee') {
    return (
      <>
        <UserProtectedRoutes role={role} token={token} />
      </>
    );
  }
}

export default App;
