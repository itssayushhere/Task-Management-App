import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './Auth/AuthContext.jsx';

const ProtectedRoute = ({ element }) => {
  const { state } = useContext(AuthContext);
  const isAuthenticated = Boolean(state.token);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
