const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@b3s/shared"],
  experimental: {
    externalDir: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

module.exports = nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
initOpenNextCloudflareForDev();
