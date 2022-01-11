/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const { createSecureHeaders } = require('next-secure-headers');

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['i.pravatar.cc'],
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: createSecureHeaders() }];
  },
};
