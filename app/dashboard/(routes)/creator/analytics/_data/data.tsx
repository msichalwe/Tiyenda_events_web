import {
	ArrowDownIcon,
	ArrowRightIcon,
	ArrowUpIcon,
	CheckCircledIcon,
	CircleIcon,
	CrossCircledIcon,
	QuestionMarkCircledIcon,
	StopwatchIcon,
} from '@radix-ui/react-icons'

export const labels = [
	{
		value: 'bug',
		label: 'Bug',
	},
	{
		value: 'feature',
		label: 'Feature',
	},
	{
		value: 'documentation',
		label: 'Documentation',
	},
]

export const statuses = [
	{
		value: 'PENDING',
		label: 'Pending',
		icon: StopwatchIcon,
	},
	{
		value: 'COMPLETED',
		label: 'Paid',
		icon: CheckCircledIcon,
	},
	{
		value: 'CANCELLED',
		label: 'Failed',
		icon: CrossCircledIcon,
	},
]
