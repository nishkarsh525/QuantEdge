// Example for src/app/api/auth/login.ts (and similar for register.ts, user.ts)

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import MongooseUser from "@/backend/models/User"; // Import the JS model
import connectDB from "@/backend/config/db";
import { IUser, UserModelType } from "@/backend/interfaces/IUser"; // Import your TS types

// Cast the imported MongooseUser (from .js) to your defined UserModelType
const User = MongooseUser as UserModelType;

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Now TypeScript knows User.findOne exists and what it returns (Promise<IUser | null>)
    const user: IUser | null = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    console.log("User Retrieved:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // user.password will be correctly typed (or undefined if not selected)
    // but because of .select('+password'), it should be there.
    // Add a check if password might be undefined (though .select should ensure it)
    if (!user.password) {
      console.error(
        "🔥 Password not found on user object after select('+password')"
      );
      return NextResponse.json(
        { error: "Server error: Could not retrieve password for comparison." },
        { status: 500 }
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("🔥 Missing JWT_SECRET in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // When returning user, you might want to strip the password
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return NextResponse.json(
      { message: "Login successful", token, user: userResponse },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🔥 Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message }, // Add details
      { status: 500 }
    );
  }
}
