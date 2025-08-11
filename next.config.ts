// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [{
//       protocol: 'https',
//       hostname: 'images.unsplash.com',
//       port: '',
//       pathname: '/**',
//     }

//       ,
//     ],
//   }

//   ,
// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 로컬 이미지를 위한 설정
    unoptimized: false,
    // 필요시 외부 이미지도 사용 가능하도록 설정
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig