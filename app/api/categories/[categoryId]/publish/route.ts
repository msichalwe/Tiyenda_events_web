import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(
	req: Request,
	{ params }: { params: { categoryId: string } },
) {
	try {
		const body = await req.json()

		const { isPublished } = body

		const category = await db.category.update({
			where: {
				id: params.categoryId,
			},
			data: {
				isPublshed: isPublished,
			},
		})

		return NextResponse.json(category)
	} catch (error) {
		console.log('[CATEGORY_ID]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
