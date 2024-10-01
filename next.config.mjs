import { env } from 'process';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    basePath: env.NODE_ENV == "development" ? "" : "/traqix-editor",
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "*",
          },
        ],
    },
};

export default nextConfig;
