/** @type {import('next').NextConfig} */

const rewrites = async () => {
  // references:
  // https://vercel.com/support/articles/can-i-redirect-from-a-subdomain-to-a-subpath
  // https://nextjs.org/docs/api-reference/next.config.js/rewrites
  return {
    beforeFiles: [
    // if the host is `pay.solfront.app`, this rewrite will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'pay.solfront.app',
          }
        ],
        destination: '/pay/:path*',
      },
    ],
  }
}

const nextConfig = {
  reactStrictMode: true,
  rewrites: rewrites,
}

module.exports = nextConfig
