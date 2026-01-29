# TradePro - Simulated Trading Platform

TradePro is a feature-rich, simulated trading platform designed to provide users with a realistic yet risk-free environment to practice trading strategies, monitor market data, and manage virtual portfolios. This project showcases a full-stack application built with modern web technologies.

## ✨ Features

TradePro offers a comprehensive suite of simulated trading and analytical tools:

- **User Authentication:** Secure user registration and login system using JWTs for session management.
- **Persistent User Data:** Watchlists and portfolio data are saved per user and persist across sessions.
- **Dynamic Dashboard:**
  - Real-time (simulated) market indices display (NIFTY50, SENSEX, etc.).
  - News feed with preset or randomly updating trading-related articles.
  - Categorized sections for Stocks, Mutual Funds, ETFs, etc.
- **Watchlist Management:**
  - Add/remove assets to a personal watchlist.
  - Monitor simulated prices in a dedicated sidebar.
- **Portfolio Tracking & Simulation:**
  - Manually add assets or simulate "buying" assets based on random data.
  - Track portfolio value, total invested, profit/loss, and asset allocation dynamically.
  - Simulate "selling" assets from the portfolio.
- **Advanced Data Simulation:**
  - **Sentiment Analysis:** Simulated sentiment scores (Positive, Neutral, Negative) displayed for assets.
  - **Candlestick Pattern Recognition:** (Conceptual) Identification of common candlestick patterns on charts.
  - **Simulated Market Orders:** Place "limit" or "market" orders that "fill" based on simulated price movements.
- **Analytical Tools:**
  - **Advanced Data Analytics Dashboard:** Display key financial indicators (e.g., moving averages, RSI, volatility).
  - **Backtesting Feature:** Test basic trading strategies against historical (simulated) random data.
- **Algorithmic Trading Bot Simulation:**
  - A simulated "trading bot" that follows a simple algorithm (e.g., buy low/sell high).
  - Users can "start" the bot and observe its simulated trades and performance.

## 🛠️ Tech Stack

- **Frontend:**
  - **Next.js (App Router):** React framework for server-side rendering and static site generation.
  - **TypeScript:** For static typing and improved code quality.
  - **React Hooks & Context API:** For state management.
  - **Axios:** For making HTTP requests to the backend.
  - **Tailwind CSS:** Utility-first CSS framework for styling.
  - **Framer Motion:** For animations and transitions.
  - **Lucide React:** For icons.
- **Backend (Next.js API Routes):**
  - **Node.js:** JavaScript runtime environment.
  - **Next.js API Routes:** Serverless functions for handling API logic.
  - **TypeScript:** For backend logic.
- **Database:**
  - **MongoDB:** NoSQL document database.
  - **Mongoose:** ODM for interacting with MongoDB.
- **Authentication:**
  - **JWT (JSON Web Tokens):** For secure user authentication.
  - **bcryptjs:** For hashing user passwords.
- **Deployment:**
  - **Vercel:** Platform for deploying Next.js applications.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn
- MongoDB instance (local or cloud-hosted like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/YashPalav-26/NullClassInternshipProject.git
    cd tradepro
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project and add the following variables:

    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_strong_jwt_secret_key

    # Example for local development if you were to run the Express backend separately (not needed if only using Next.js API routes)
    # NEXT_PUBLIC_API_BASE_URL_DEV=http://localhost:5000
    ```

    - Replace `your_mongodb_connection_string` with your actual MongoDB connection URI.
    - Replace `your_strong_jwt_secret_key` with a strong, random secret.

4.  **Ensure MongoDB Atlas IP Whitelist (if using Atlas):**
    If you're using MongoDB Atlas, make sure to add your local IP address and `0.0.0.0/0` (for Vercel deployment) to the IP Access List in your Atlas project settings.

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The API routes will be accessible under `/api/*`.

### Building for Production

```bash
npm run build
```
