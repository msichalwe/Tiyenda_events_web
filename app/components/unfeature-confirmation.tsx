'use client'

import { useTransition } from 'react'
import Image from 'next/image'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { unfeatureEvent } from '@/actions'

const UnFeatureConfirmation = ({ eventId }: { eventId: string }) => {
	let [isPending, startTransition] = useTransition()
	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<Button className="" size={'sm'} variant={'destructive'}>
					Unfeature
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="bg-white">
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to remove this featured event?
					</AlertDialogTitle>
					<AlertDialogDescription className="p-regular-16 text-grey-600">
						This will remove the event from the feature section.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<AlertDialogAction
						onClick={() =>
							startTransition(async () => {
								await unfeatureEvent(eventId)
							})
						}>
						{isPending ? 'Removing...' : 'Remove'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default UnFeatureConfirmation
