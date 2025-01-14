import { useAuthState, useSignInWithEmailAndPassword, useCreateUserWithEmailAndPassword, useIdToken, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';  // Firebase auth initialization
import { signOut } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAuth = () => {
  const navigate = useNavigate(); // useNavigate for redirecting
  const [user, loading, error] = useAuthState(auth); // Firebase auth state
  const [signInWithEmailAndPassword, userCred, signInError] = useSignInWithEmailAndPassword(auth); // Email/Password Sign In
  const [createUserWithEmailAndPassword, newUserCred, signUpError] = useCreateUserWithEmailAndPassword(auth); // Create user
  const [idToken, loadingToken, errorToken] = useIdToken(auth); // ID Token
  const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth); // Google Sign In

  // Send token to backend
  const sendTokenToBackend = async (token) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/saveUser', {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
      console.log('User saved to backend:', response.data);
    } catch (error) {
      console.error('Error sending token to backend:', error.response || error);
    }
  };


  // Logout function that clears the token
  const logout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      console.log("User logged out successfully");
      navigate("/login"); // Redirect user to login page after logout
    } catch (err) {
      console.error("Error logging out: ", err);
    }
  };

  // Ensure token is cleared after logout
  useEffect(() => {
    if (!user) {
      // Clear the idToken if the user is logged out
      localStorage.removeItem('idToken'); // Clear the token in localStorage
      console.log("Token cleared");
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    logout,
    idToken,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendTokenToBackend,
    signInError: signInError ? signInError.message : null,
    signUpError: signUpError ? signUpError.message : null,
    signInWithGoogle,
    googleUser,
    googleLoading,
    googleError,
  };
};
