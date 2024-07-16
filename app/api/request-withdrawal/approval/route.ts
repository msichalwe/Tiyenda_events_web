import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
	try {
		const body = await req.json()

		const { id, status } = body

		const withdrawal = await db.fundsRequst.update({
			where: {
				id,
			},
			data: {
				status,
			},
		})

		return NextResponse.json(withdrawal)
	} catch (error) {
		console.log('[APPROVAL ERROR]', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
