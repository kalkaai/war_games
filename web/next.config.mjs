/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  transpilePackages: ["@gamides/minigames"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
