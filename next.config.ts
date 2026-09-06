import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Images uploaded through the admin portal are served from the
      // Supabase storage bucket, so next/image has to be told they are
      // allowed. Scoped to the public object path, not the whole host.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
