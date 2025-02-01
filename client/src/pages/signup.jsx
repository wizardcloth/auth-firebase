import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; // Custom hook to handle authentication
import { auth, GoogleAuthProvider, signInWithPopup } from '../firebase';
const Signup = () => {
  const navigate = useNavigate();
  const { createUserWithEmailAndPassword, user, sendTokenToBackend, signUpError, idToken, signInWithGoogle, googleUser, googleLoading, googleError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state to manage signup process
  
  // Validate email and password
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    // Validate form
    if (!validateForm()) return;
  
    setLoading(true); // Start loading
  
    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(email, password);
      const newUser = userCredential.user;
  
      // Check if user is successfully created
      if (!newUser) {
        throw new Error("User creation failed.");
      }
  
      // Get the token
      const token = await newUser.getIdToken();
      if (!token) {
        throw new Error("Failed to retrieve ID token.");
      }
  
      // Send token to backend
      await sendTokenToBackend(token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error.message); // Log detailed error for debugging
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true); // Start loading
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth,provider); // Use the pop-up method
      const user = result.user; // Get the user after successful Google sign-in
      console.log("Google User:", user); // Log the user information for debugging
      const token = await user.getIdToken(); // Get the Firebase ID Token
      console.log("Firebase Token:", token); // Log the token for debugging
      await sendTokenToBackend(token); // Send the token to the backend after Google sign-up
      navigate("/dashboard"); // Redirect to dashboard after successful signup
    } catch (err) {
      console.error("Google Sign-Up Error:", err); // Log the error object for debugging
      setError(googleError || "Failed to sign up with Google."); // Display the error message
    } finally {
      setLoading(false); // Stop loading after the process
    }
  };
  
  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
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
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <div>
        <button onClick={() => navigate("/login")} disabled={loading}>Already have an account?</button>
        <button onClick={handleGoogleSignup} disabled={googleLoading || loading}>
          {googleLoading || loading ? "Signing up with Google..." : "Sign Up with Google"}
        </button>
      </div>
    </div>
  );
};

export default Signup;
