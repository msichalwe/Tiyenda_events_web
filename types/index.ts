export type GetAllEventsParams = {
	query: string
	limit: number
	page: number
	categoryId?: string
}
export type GetAllUsersParams = {
	query: string
	limit: number
}

export type GetEventsByUserParams = {
	userId: string
	limit?: number
	page: number
}

export type GetRelatedEventsByCategoryParams = {
	categoryId: string
	eventId: string
	limit?: number
	page: number | string
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
	params: string
	key: string
	value: string | null
}

export type RemoveUrlQueryParams = {
	params: string
	keysToRemove: string[]
}

export type SearchParamProps = {
	params: { id: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export type TransactionResponse = {
	Result: string
	ResultExplanation: string
}
