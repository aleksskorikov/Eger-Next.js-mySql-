/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/static/**', // Путь должен начинаться с /static/
      },
    ],
  },
};

export default nextConfig;
