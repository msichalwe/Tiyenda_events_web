/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: [
			'localhost',
			'res.cloudinary.com',
			'images.unsplash.com',
			'unsplash.com',
			'utfs.io',
		],
	},
}

module.exports = nextConfig;
