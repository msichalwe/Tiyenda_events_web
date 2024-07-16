import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const body = await req.json()

		const withdrawal = await db.fundsRequst.create({
			data: {
				...body,
			},
		})

		return NextResponse.json(withdrawal)
	} catch (error) {
		console.log('[WITHDRAWAL ERROR]', error)
		return new NextResponse('Intern server error', { status: 500 })
	}
}
