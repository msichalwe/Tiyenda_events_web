'use client'
import { Input } from '@/components/ui/input'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Search = ({
	placeholder = 'Search name...',
}: {
	placeholder?: string
}) => {
	const [query, setQuery] = useState('')
	const searchParams = useSearchParams()
	const router = useRouter()

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			let newUrl = ''
			if (query) {
				newUrl = formUrlQuery({
					params: searchParams.toString(),
					key: 'query',
					value: query,
				})
			} else {
				newUrl = removeKeysFromQuery({
					params: searchParams.toString(),
					keysToRemove: ['query'],
				})
			}

			router.push(newUrl, { scroll: false })
		}, 300)

		return () => clearTimeout(delayDebounceFn)
	}, [query, searchParams, router])

	return (
		<div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
			<SearchIcon className="w-5 h-5 text-gray-400" />
			<Input
				className="p-regular-16 border-0 bg-gray-50 placeholder:text-gray-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
				type="text"
				placeholder={placeholder}
				onChange={(e) => setQuery(e.target.value)}
			/>
		</div>
	)
}

export default Search
