// src/app/api/auth/user.ts

import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"; // Import JwtPayload
import MongooseUser from "@/backend/models/User"; // Import the JS model
import connectDB from "@/backend/config/db";
import { IUser, UserModelType } from "@/backend/interfaces/IUser"; // Import your TS types

// Cast the imported MongooseUser (from .js) to your defined UserModelType
const User = MongooseUser as UserModelType;

// Define a more specific type for your decoded JWT payload
interface DecodedToken extends JwtPayload {
  userId: string;
}

export async function GET(req: Request) {
  console.log("[USER API] Attempting to connect to DB...");
  try {
    await connectDB();
    console.log("[USER API] DB Connection successful (or cached).");
  } catch (dbError: any) {
    console.error("[USER API] 🔥 DB Connection Error:", dbError.message);
    return NextResponse.json(
      { error: "Database connection failed.", details: dbError.message },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized - Token not provided" },
      { status: 401 }
    );
  }

  if (!process.env.JWT_SECRET) {
    console.error("[USER API] 🔥 Missing JWT_SECRET in environment variables");
    return NextResponse.json(
      { error: "Server configuration error - JWT secret missing" },
      { status: 500 }
    );
  }

  try {
    // Use the DecodedToken type for better type safety
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    console.log("[USER API] Decoded Token:", decoded);

    // The 'userId' should now be correctly typed on 'decoded'
    if (!decoded.userId) {
      // This check might be redundant if jwt.verify throws or if DecodedToken interface is strict,
      // but it's a good safeguard.
      return NextResponse.json(
        { error: "Invalid token: Token does not contain userId" },
        { status: 400 }
      );
    }

    // TypeScript now knows User.findById exists and what it returns
    // Since password is select: false in the schema, it won't be returned by default
    const user: IUser | null = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // The 'user' object here will not have the password field by default due to `select: false`
    // which is typically what you want when returning user data.
    return NextResponse.json({ user: user.toObject() }, { status: 200 }); // Use .toObject() for plain JS object
  } catch (error: any) {
    console.error(
      "[USER API] Token Verification or User Fetch Error:",
      error.message
    );
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Error retrieving user data", details: error.message },
      { status: 500 }
    );
  }
}
