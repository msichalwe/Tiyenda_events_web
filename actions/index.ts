'use server'
import getCurrentUser from '@/app/actions/getCurrentUser'
import { transporter } from '@/config/nodemailer'
import { db } from '@/lib/db'
import { handleError } from '@/lib/utils'
import { GetAllEventsParams, GetAllUsersParams } from '@/types'

export async function ViewEvent(id: string) {
	const user = await getCurrentUser()

	if (!user) {
		return null
	}

	const view = await db.eventView.create({
		data: {
			eventId: id,
			userId: user.id,
		},
	})

	return view
}

export const getAllEvents = async ({
	query,
	limit = 6,
	page,
	categoryId,
}: GetAllEventsParams) => {
	try {
		const eventsQuery = await db.event.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				name: {
					contains: query,
					mode: 'insensitive',
				},
				// endDate: {
				// 	gte: new Date(),
				// },
				isPublished: true,
				...(categoryId && { categoryId }),
			},
			include: {
				Category: true,
				Ticket: true,
				organizer: true,
			},
			skip: 0,
			take: limit,
		})

		return {
			data: eventsQuery,
			totalPages: Math.ceil(eventsQuery.length / limit),
		}
	} catch (error) {
		handleError(error)
	}
}

export const fetchEvents = async (page: number) => {
	try {
		const pageSize = 10 // Replace with your desired page size
		const pageOffset = (page - 1) * pageSize // Calculate offset
		const events = await db.event.findMany({
			where: {
				isPublished: true,
				// endDate: {
				// 	gte: new Date(),
				// },
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				Category: true,
				Ticket: true,
				organizer: true,
			},
			skip: pageOffset,
			take: pageSize,
		})

		return events
	} catch (error) {
		handleError(error)
	}
}

export const getAllUsers = async ({ query, limit = 6 }: GetAllUsersParams) => {
	try {
		const userQuery = await db.user.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				name: {
					contains: query,
					mode: 'insensitive',
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
			},
			skip: 0,
			take: limit,
		})

		return userQuery
	} catch (error) {
		handleError(error)
	}
}

export const getAllFeaturedEvents = async ({
	query,
	limit = 6,
	page,
	categoryId,
}: GetAllEventsParams) => {
	try {
		const eventsQuery = await db.event.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				name: {
					contains: query,
					mode: 'insensitive',
				},
				isFeatured: true,
				// endDate: {
				// 	gte: new Date(),
				// },
				isPublished: true,
				...(categoryId && { categoryId }),
			},
			include: {
				Category: true,
				Ticket: true,
				organizer: true,
				EventView: true,
			},
			skip: 0,
			take: limit,
		})

		return {
			data: eventsQuery,
			totalPages: Math.ceil(eventsQuery.length / limit),
		}
	} catch (error) {
		handleError(error)
	}
}

export const getAllCategories = async () => {
	try {
		const categories = await db.category.findMany({
			where: {
				isPublshed: true,
			},
		})

		return categories
	} catch (error) {
		handleError(error)
	}
}

export const featureEvent = async (eventId: string) => {
	try {
		const event = await db.event.update({
			where: {
				id: eventId,
			},
			data: {
				isFeatured: true,
			},
		})

		return event
	} catch (error) {
		handleError(error)
	}
}
export const unfeatureEvent = async (eventId: string) => {
	try {
		const event = await db.event.update({
			where: {
				id: eventId,
			},
			data: {
				isFeatured: false,
			},
		})

		return event
	} catch (error) {
		handleError(error)
	}
}

export const inviteUser = async (userId: string, organizerId: string) => {}
