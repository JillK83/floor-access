/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static1.squarespace.com',
      },
      {
        protocol: 'https',
        hostname: 'www.asianbarnnyc.com',
      },
    ],
  },
};

export default nextConfig;
