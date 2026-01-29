// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // The rewrites function that was causing the problem is now removed/commented out.
  /*
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:5000/api/:path*" // This was for local only
            : "https://your-deployed-backend-url.com/api/:path*", // This was problematic
      },
    ];
  },
  */

  transpilePackages: ['framer-motion'],

  transpilePackages: ['framer-motion'],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
