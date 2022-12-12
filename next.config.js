/** @type {import('next').NextConfig} */
const isDev = 'development'

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "./",
  images: {
    unoptimized: true,
  },
  webpack: config => {
    if (isDev) {
      return config;
    }

    return {
      ...config,
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    };
  },
};

module.exports = nextConfig;