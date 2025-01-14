import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <>
      <Navigate to="/login" />; // Redirect to login if the user is not authenticated
    </>
  }

  return children; // Allow access to the protected route if authenticated
};

export default ProtectedRoute;
