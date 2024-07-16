import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { auth } from '@/auth'

const f = createUploadthing()

const handleAuth = async () => {
	const session = await auth()

	const userId = session?.user?.id

	if (!userId) {
		throw new Error('Unauthorized')
	}

	return { userId }
}
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	eventImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	organizerImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	eventAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
