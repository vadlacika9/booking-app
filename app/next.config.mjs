/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ceouekx9cbptssme.public.blob.vercel-storage.com',
        port: '', // Ha nem használsz speciális portot
        pathname: '/**', // Engedélyezés minden útvonalra ezen a hoszton belül
      },
    ],
  },
};

export default nextConfig;