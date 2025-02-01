import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; // Custom hook to handle authentication
import { auth, GoogleAuthProvider, signInWithPopup } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const { signInWithEmailAndPassword, user, sendTokenToBackend, signInError, idToken, signInWithGoogle, googleUser, googleLoading, googleError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state for email/password login

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Redirect to dashboard if already logged in
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    // Check if email and password are provided
    if (!email || !password) {
      setError('Please enter both email and password.');
      return; // Don't proceed if fields are empty
    }

    setLoading(true); // Set loading state to true
    
    try {
      await signInWithEmailAndPassword(email, password);
      
      // Get the token and send it to the backend
      if (idToken) {
        await sendTokenToBackend(idToken); 
      }

      navigate("/dashboard");
    } catch (err) {
      // Handle specific Firebase errors if available
      const errorMessage = signInError?.message || "Failed to log in. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleGoogleLogin = async () => {
    setError(''); // Clear any previous errors
    setLoading(true); // Set loading state to true
    
    try {
      const provider = new GoogleAuthProvider(); // Initialize the Google provider
      const result = await signInWithPopup(auth,provider); // Sign in with the popup method
  
      const user = result.user; // Get the authenticated user
      console.log("Google User:", user); // Log user details for debugging
      
      const token = await user.getIdToken(); // Get the Firebase ID token
      console.log("Firebase Token:", token); // Log the token for debugging
  
      // Send the ID token to your backend
      await sendTokenToBackend(token);
      
      navigate("/dashboard"); // Redirect to the dashboard after login
    } catch (err) {
      console.error("Google Login Error:", err); // Log the error for debugging
      setError(googleError || "Failed to log in with Google. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };
  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p>{error}</p>} {/* Display errors */}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div>
        <button onClick={() => navigate("/signup")}>Don't have an account?</button>
        <button onClick={handleGoogleLogin} disabled={googleLoading || loading}>
          {googleLoading || loading ? "Logging in with Google..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
