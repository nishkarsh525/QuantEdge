import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import MongooseUser from "@/backend/models/User"; // Import the JS model
import connectDB from "@/backend/config/db";
import {
  IUser,
  UserModelType,
  WatchlistItem as IUserWatchlistItem,
  PortfolioItem as IUserPortfolioItem,
} from "@/backend/interfaces/IUser"; // Import your TS types

// Cast the imported MongooseUser (from .js) to your defined UserModelType
const User = MongooseUser as UserModelType;

interface DecodedToken extends JwtPayload {
  userId: string;
}

// --- GET Handler: Fetch Watchlist and Portfolio ---
export async function GET(req: Request) {
  console.log("[ASSETS API GET] Attempting to connect to DB...");
  try {
    await connectDB();
    console.log("[ASSETS API GET] DB Connection successful (or cached).");
  } catch (dbError: any) {
    console.error("[ASSETS API GET] 🔥 DB Connection Error:", dbError.message);
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
    console.error("[ASSETS API GET] 🔥 Missing JWT_SECRET");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    if (!decoded.userId) {
      return NextResponse.json(
        { error: "Invalid token: Missing userId" },
        { status: 400 }
      );
    }

    const user: IUser | null = await User.findById(decoded.userId).select(
      "watchlist portfolio"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("[ASSETS API GET] Fetched assets for user:", decoded.userId);
    return NextResponse.json(
      {
        watchlist: user.watchlist || [], // Ensure arrays are returned even if undefined
        portfolio: user.portfolio || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[ASSETS API GET] 🔥 Error fetching assets:", error.message);
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
      { error: "Failed to fetch assets", details: error.message },
      { status: 500 }
    );
  }
}

// --- POST Handler: Save Watchlist and Portfolio ---
export async function POST(req: Request) {
  console.log("[ASSETS API POST] Attempting to connect to DB...");
  try {
    await connectDB();
    console.log("[ASSETS API POST] DB Connection successful (or cached).");
  } catch (dbError: any) {
    console.error("[ASSETS API POST] 🔥 DB Connection Error:", dbError.message);
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
    console.error("[ASSETS API POST] 🔥 Missing JWT_SECRET");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    if (!decoded.userId) {
      return NextResponse.json(
        { error: "Invalid token: Missing userId" },
        { status: 400 }
      );
    }

    const user: IUser | null = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { watchlist, portfolio } = (await req.json()) as {
      watchlist?: IUserWatchlistItem[]; // Use types from IUser
      portfolio?: IUserPortfolioItem[];
    };

    // Validate incoming data a bit (optional but good)
    if (watchlist && !Array.isArray(watchlist)) {
      return NextResponse.json(
        { error: "Invalid watchlist data: must be an array." },
        { status: 400 }
      );
    }
    if (portfolio && !Array.isArray(portfolio)) {
      return NextResponse.json(
        { error: "Invalid portfolio data: must be an array." },
        { status: 400 }
      );
    }

    // Only update fields if they are provided in the request body
    if (watchlist !== undefined) {
      user.watchlist = watchlist;
    }
    if (portfolio !== undefined) {
      user.portfolio = portfolio;
    }

    await user.save();

    console.log("[ASSETS API POST] Saved assets for user:", decoded.userId);
    return NextResponse.json(
      { message: "Assets saved successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[ASSETS API POST] 🔥 Error saving assets:", error.message);
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
      { error: "Failed to save assets", details: error.message },
      { status: 500 }
    );
  }
}
