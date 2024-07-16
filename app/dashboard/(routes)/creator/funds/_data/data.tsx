import {
	CheckCircledIcon,
	CrossCircledIcon,
	StopwatchIcon,
} from '@radix-ui/react-icons'

export const statuses = [
	{
		value: 'PENDING',
		label: 'Pending Withdrawal',
		icon: StopwatchIcon,
	},
	{
		value: 'APPROVED',
		label: 'Approved Withdrawal',
		icon: CheckCircledIcon,
	},
]
