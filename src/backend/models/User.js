// src/backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    watchlist: [{ name: String, price: Number }],
    portfolio: [{ name: String, price: Number, quantity: Number }],
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

// This JavaScript logic is fine for runtime
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
