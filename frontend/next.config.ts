import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* Cấu hình cho phép hiển thị ảnh từ via.placeholder.com */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  /* Giữ nguyên phần cấu hình rewrites hiện tại của bạn */
  async rewrites() {
    const backendBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1'

    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendBaseUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
