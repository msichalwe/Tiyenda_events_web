import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const { name, description, imageUrl } = body
		const category = await db.category.create({
			data: {
				name,
				description,
				imageUrl,
			},
		})

		return NextResponse.json(category)
	} catch (error) {
		console.log('[CATEGORIES]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function GET(req: Request) {
	try {
		const categories = await db.category.findMany({})

		return NextResponse.json(categories)
	} catch (error) {
		console.log('[CATEGORIES]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
