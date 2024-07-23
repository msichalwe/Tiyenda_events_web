'use client'

import { UploadDropzone } from '@/lib/uploadthing'
import { ourFileRouter } from '@/app/pages/api/uploadthing/core'
import toast from 'react-hot-toast'

interface FileUploadProps {
	onChange: (url?: string) => void
	endpoint: keyof typeof ourFileRouter
}

export const FileUpload: React.FC<FileUploadProps> = ({
	onChange,
	endpoint,
}) => {
	return (
		<UploadDropzone
			onClientUploadComplete={(res) => {
				onChange(res?.[0].url)
			}}
			endpoint={endpoint}
			onUploadError={(error: Error) => {
				toast.error(`${error?.message}`)
			}}
		/>
	)
}
