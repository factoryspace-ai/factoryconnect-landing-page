/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'pub-5fb7c70eda5b463e89af3d4f5a6241ea.r2.dev',
          port: '',
          pathname: '/**',
        },
      ],
      unoptimized: true,
    },
    experimental: {
      serverActions: {
        allowedOrigins: ['*'],
        bodySizeLimit: '2mb'
      },
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          stream: false,
          crypto: false,
          http: false,
          https: false,
          os: false,
          zlib: false,
          net: false,
          tls: false,
          fs: false,
        };
      }
      return config;
    },
  };
  
  export default nextConfig;
  