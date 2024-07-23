import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const { email, name, image, userId } = body

		const existingUser = await db.user.findUnique({
			where: {
				email,
			},
		})

		if (existingUser) {
			return new NextResponse('User already exists', { status: 400 })
		}

		const newUser = await db.user.create({
			data: {
				email,
				name,
				image,
				fireBaseId: userId,
			},
		})

		return NextResponse.json(newUser)
	} catch (error) {
		console.log('[REGISTER]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
