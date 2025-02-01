import express from 'express';
import admin from '../firebaseAdmin.js'; // Firebase Admin SDK
import User from '../models/user.js'; // Import the User model
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Middleware to verify the Firebase ID token
router.post("/saveUser", async (req, res) => {
  // Ensure token is provided and starts with "Bearer "
  const token = req.headers.authorization?.split("Bearer ")[1];
  
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);

    const { uid, email } = decodedToken;

    // Check if the user exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // If the user doesn't exist, create a new user in MongoDB
      user = new User({
        firebaseUid: uid,
        email,
        // You can add other user data here like name, profile photo, etc.
      });
      await user.save();
    }

    // Return the user data to the client
    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("Error verifying token:", error);

    // Differentiate error types to send appropriate status codes and messages
    if (error.code === 'auth/argument-error') {
      return res.status(400).json({ message: "Invalid token format" });
    }
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: "Token has expired" });
    }

    // Generic error message for any other issues
    res.status(500).json({ message: "Failed to verify or save user", error: error.message });
  }
});

export default router;
