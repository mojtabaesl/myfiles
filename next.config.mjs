/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "warmhearted-bear-304.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
