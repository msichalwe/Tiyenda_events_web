import {
	CheckCircledIcon,
	CrossCircledIcon,
	StopwatchIcon,
} from '@radix-ui/react-icons'

export const statuses = [
	{
		value: 'PENDING',
		label: 'Pending Refund',
		icon: StopwatchIcon,
	},
	{
		value: 'APPROVED',
		label: 'Refunded',
		icon: CheckCircledIcon,
	},
]
