/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig
