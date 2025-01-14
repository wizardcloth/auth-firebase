import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; // Import the custom hook

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Check if the user is authenticated. If not, navigate to the login page.
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login"); // Redirect to login page if the user is not authenticated
  //   }
  // }, [user, navigate]); // Depend on user and navigate to ensure correct redirection

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirect to login page after logging out
  };

  // If user is not authenticated, the component will be redirected before rendering
  if (!user) {
    return null; // You can return null or a loading state while navigating
  }

  return (
    <div>
      <h2>Welcome to your Dashboard, {user.displayName || 'User'}!</h2>
      <p>You are logged in as {user.email}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
