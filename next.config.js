/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nvxcwidvcmwqkzucuhyw.supabase.co',
      }
    ],
    unoptimized: true
  },
  output: 'standalone'
}

module.exports = nextConfig 