import { z } from 'zod'

export const transactionSchema = z.object({
	id: z.string(),
	name: z.string(),
	amount: z.string(),
	date: z.string(),
	phoneNumber: z.string(),
	status: z.string(),
	event: z.string(),
})

export type Transaction = z.infer<typeof transactionSchema>
