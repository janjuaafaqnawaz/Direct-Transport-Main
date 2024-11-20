/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.pixabay.com",
      "images.pexel.com",
      "img.freepik.com",
      "localhost",
      "firebasestorage.googleapis.com",
<<<<<<< HEAD
=======
      "courierssydney.com.au",
>>>>>>> beta
      "directtransport.com.au",
    ],
  },
  /* config options here */
  experimental: {
    // …
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
};

module.exports = nextConfig;
