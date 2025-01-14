import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; // Custom hook to handle authentication

const Login = () => {
  const navigate = useNavigate();
  const { signInWithEmailAndPassword, user, sendTokenToBackend, signInError, idToken, signInWithGoogle, googleUser, googleLoading, googleError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

    try {
      await signInWithEmailAndPassword(email, password);
      // await sendTokenToBackend(); // Send the token to the backend after login
      navigate("/dashboard");
    } catch (err) {
      // Check if the error is from Firebase and display the error accordingly
      const errorMessage = signInError?.message || "Failed to log in. Please check your credentials.";
      setError(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    setError(''); // Clear any previous errors
    try {
      await signInWithGoogle();
      await sendTokenToBackend(); // Send the token to the backend after Google login
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = googleError?.message || "Failed to log in with Google. Please try again.";
      setError(errorMessage);
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
        <button type="submit">Login</button>
      </form>

      <div>
        <button onClick={() => navigate("/signup")}>Don't have an account?</button>
        <button onClick={handleGoogleLogin} disabled={googleLoading}>
          {googleLoading ? "Logging in with Google..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
