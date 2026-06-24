const {initOpenNextCloudflareForDev} = require("@opennextjs/cloudflare")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@kotobad/shared"],
  experimental: {
    externalDir: true,
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
    images: {
        remotePatterns: [
            {
                protocol: "https", 
                hostname: "assets.kotobad.com", 
                pathname: "/tags/**"
            }
        ]
    }
};

module.exports = nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
initOpenNextCloudflareForDev();
