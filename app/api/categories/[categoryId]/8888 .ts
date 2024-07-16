import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
	req: Request,
	{ params }: { params: { categoryId: string } },
) {
	try {
		const category = await db.category.findUnique({
			where: {
				id: params.categoryId,
			},
			include: {
				events: true,
			},
		})

		return NextResponse.json(category)
	} catch (error) {
		console.log('[CATEGORY_ID]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { categoryId: string } },
) {
	try {
		const category = await db.category.delete({
			where: {
				id: params.categoryId,
			},
		})

		return NextResponse.json(category)
	} catch (error) {
		console.log('[CATEGORY_ID]', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
