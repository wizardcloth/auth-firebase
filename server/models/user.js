import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { 
    type: String, 
    required: true,
    unique: true,  // Ensure firebaseUid is unique in the database
  },
  email: { 
    type: String, 
    required: true,
    unique: true, // Email should also be unique in the database
  },
  // Add other fields like name, profile photo, etc.
  name: { type: String },
  profilePhoto: { type: String },
});

// Ensure proper indexes to avoid duplicate values
// userSchema.index({ firebaseUid: 0 }, { unique: true });
// userSchema.index({ email: 0 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;
