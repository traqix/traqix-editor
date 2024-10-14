import { env } from "process";

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
  assetPrefix: "/",
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Adicione o `isolated-vm` como um módulo externo no lado do servidor
      config.externals.push("isolated-vm");
    }

    return config;
  },
};

export default nextConfig;
