import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const withdrawal = await db.fundsRequst.delete({
			where: {
				id: params.id,
			},
		})
		return NextResponse.json(withdrawal)
	} catch (error) {
		console.log('[WITHDRAWAL ERROR]', error)
		return new NextResponse('Intern server error', { status: 500 })
	}
}
