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
import { featureEvent } from '@/actions'

const FeatureConfirmation = ({ eventId }: { eventId: string }) => {
	let [isPending, startTransition] = useTransition()
	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<Button size={'sm'} variant={'outline'}>
					Feature
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="bg-white">
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to Feature this event?
					</AlertDialogTitle>
					<AlertDialogDescription className="p-regular-16 text-grey-600">
						This will add the event to the feature section.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>

					<AlertDialogAction
						onClick={() =>
							startTransition(async () => {
								await featureEvent(eventId)
							})
						}>
						{isPending ? 'Adding...' : 'Add'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default FeatureConfirmation
