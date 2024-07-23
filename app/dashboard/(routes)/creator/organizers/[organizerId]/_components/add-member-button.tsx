'use client'
import { Button } from '@/components/ui/button'
import AddMembarModal from '@/components/ui/modal/add-member-modal'
import { useAddMemberModal } from '@/hooks/user-add-member'
import { useParams } from 'next/navigation'

const AddMemberButton = () => {
	const params = useParams()
	const onOpen = useAddMemberModal((state) => state.onAddMenuOpen)
	const isOpen = useAddMemberModal((state) => state.isAddMenuOpen)

	return (
		<>
			<Button onClick={onOpen}>Add Member</Button>
		</>
	)
}

export default AddMemberButton
