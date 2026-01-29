// src/app/api/auth/register.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import MongooseUser from "@/backend/models/User"; // Import the JS model
import connectDB from "@/backend/config/db";
import { IUser, UserModelType } from "@/backend/interfaces/IUser"; // Import your TS types

// Cast the imported MongooseUser (from .js) to your defined UserModelType
const User = MongooseUser as UserModelType;

export async function POST(req: Request) {
  console.log("[REGISTER API] Attempting to connect to DB...");
  try {
    await connectDB();
    console.log("[REGISTER API] DB Connection successful (or cached).");
  } catch (dbError: any) {
    console.error(
      "[REGISTER API] 🔥 DB Connection Error before processing request:",
      dbError.message
    );
    return NextResponse.json(
      { error: "Database connection failed.", details: dbError.message },
      { status: 500 }
    );
  }

  try {
    console.log("[REGISTER API] 🔍 Incoming Registration Request");

    const body = await req.json();
    console.log("[REGISTER API] 📥 Request Body:", body);

    if (!body?.username || !body?.email || !body?.password) {
      console.log("[REGISTER API] 🚨 Missing Fields Detected");
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const { username, email, password } = body;

    // Verify User Model Exists and is a function (Mongoose model constructor)
    // This also helps TypeScript infer 'User' correctly in subsequent lines.
    if (
      !User ||
      typeof User.findOne !== "function" ||
      typeof User.prototype.save !== "function"
    ) {
      console.error(
        "[REGISTER API] 🔥 User Model Not Found or not a Mongoose model."
      );
      return NextResponse.json(
        { error: "User model error - server misconfiguration" },
        { status: 500 }
      );
    }
    console.log("[REGISTER API] User model appears to be valid.");

    // TypeScript knows User.findOne exists
    const existingUser: IUser | null = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    console.log(
      "[REGISTER API] 🔍 Checking If User Exists Result:",
      existingUser ? existingUser._id : null
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    console.log("[REGISTER API] 🔒 Hashing Password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("[REGISTER API] ✅ Password Hashed Successfully");

    // 'User' here is the typed Mongoose model constructor
    const newUser = new User({
      username: username.trim(), // Added trim
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      // watchlist and portfolio will default to empty arrays based on schema if not provided
    });

    await newUser.save(); // newUser is an instance of IUser
    console.log(
      "[REGISTER API] ✅ User Saved Successfully. New User ID:",
      newUser._id
    );

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[REGISTER API] 🔥 Processing Failed:", error.message);
    // Log the full error for more details: console.error(error);

    if (error.name === "ValidationError") {
      // Mongoose validation errors
      const messages = Object.values(error.errors).map(
        (val: any) => val.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: messages.join(", ") },
        { status: 400 }
      );
    } else if (error.code === 11000) {
      // MongoDB duplicate key error (e.g., if email unique index is violated despite prior check - race condition)
      return NextResponse.json(
        { error: "Email already exists (duplicate key)." },
        { status: 409 }
      ); // 409 Conflict
    }

    return NextResponse.json(
      { error: `Error registering user.`, details: error.message },
      { status: 500 }
    );
  }
}
