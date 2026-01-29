import { Document, Model } from "mongoose";

export interface WatchlistItem {
  name: string;
  price?: number;
}

export interface PortfolioItem {
  name: string;
  price?: number;
  quantity?: number;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  watchlist: WatchlistItem[];
  portfolio: PortfolioItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserModelType = Model<IUser>;
