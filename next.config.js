/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REPLICHAT_DB_CONNECTION_STRING: process.env.REPLICHAT_DB_CONNECTION_STRING,
  },
}

module.exports = nextConfig
