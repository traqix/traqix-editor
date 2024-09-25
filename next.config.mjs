/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    basePath: "/traqix-editor",
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
