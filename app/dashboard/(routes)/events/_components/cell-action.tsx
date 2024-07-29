'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { EventColumn } from './columns'
import { useParams, useRouter } from 'next/navigation'
import {Edit, Eye, MoreHorizontal, Trash} from 'lucide-react'
import {useState} from "react";

type CellActionProps = {
	data: EventColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter()
	const [isOpen, setIsOpen] = useState<boolean>(true);




	function onDelete(){

	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => router.push(`/dashboard/events/view/${data.id}`)}>
						<Eye className="mr-2 h-4 w-4" />
						View
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => router.push(`/dashboard/events/${data.id}`)}>
						<Edit className="mr-2 h-4 w-4" />
						Update
					</DropdownMenuItem>

					<AlertDialogTrigger asChild>

					<DropdownMenuItem
						onClick={onDelete}>
						<Trash className="mr-2 h-4 w-4" />
						Delete
					</DropdownMenuItem>
					</AlertDialogTrigger>

				</DropdownMenuContent>
			</DropdownMenu>


		</>
	)
}



interface AlertModalProps {
	onCancel: () => void;
	onContinue: () => void;
}

export function AlertModal({ onCancel, onContinue }: AlertModalProps) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="outline">Show Dialog</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to complete this action?
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

