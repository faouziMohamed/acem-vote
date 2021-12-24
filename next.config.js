/** @type {import('next').NextConfig} */
const { createSecureHeaders } = require('next-secure-headers');

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: createSecureHeaders() }];
  },
};
