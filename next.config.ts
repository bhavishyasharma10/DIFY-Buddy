import type {NextConfig} from 'next';
import withPWA from 'next-pwa';

const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};


export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig);
