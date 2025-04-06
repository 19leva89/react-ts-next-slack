import Quill from 'quill'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { useRef, useState } from 'react'
import { ConvexError } from 'convex/values'

import { useWorkspaceId } from '@/hooks'
import { Id } from '../../../../../../../convex/_generated/dataModel'
import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'

const Editor = dynamic(() => import('@/components/shared/editor'), { ssr: false })

type EditorValue = {
	body: string
	image: File | null
}

type CreateMessageValues = {
	body: string
	image: Id<'_storage'> | undefined
	workspaceId: Id<'workspaces'>
	conversationId: Id<'conversations'>
}
interface Props {
	conversationId: Id<'conversations'>
	placeholder: string
}

export const ChatInput = ({ conversationId, placeholder }: Props) => {
	const workspaceId = useWorkspaceId()
	const editorRef = useRef<Quill | null>(null)

	const [editorKey, setEditorKey] = useState<number>(0)
	const [isPending, setIsPending] = useState<boolean>(false)

	const { mutate: createMessage } = useCreateMessage()
	const { mutate: generateUploadUrl } = useGenerateUploadUrl()

	const handleSubmit = async ({ body, image }: EditorValue) => {
		try {
			setIsPending(true)
			editorRef.current?.disable()

			const values: CreateMessageValues = { body, image: undefined, workspaceId, conversationId }

			if (image) {
				const url = await generateUploadUrl({ throwOnError: true })

				if (!url) {
					throw new ConvexError('Failed to generate upload url')
				}

				const result = await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': image.type },
					body: image,
				})

				if (!result.ok) {
					throw new ConvexError('Failed to upload image')
				}

				const { storageId } = await result.json()

				values.image = storageId
			}

			await createMessage(values, { throwOnError: true })

			setEditorKey((prevKey) => prevKey + 1)
		} catch (error) {
			toast.error('Failed to create message')
		} finally {
			setIsPending(false)
			editorRef.current?.enable()
		}
	}

	return (
		<div className="w-full px-5">
			<Editor
				key={editorKey}
				onSubmit={handleSubmit}
				placeholder={placeholder}
				disabled={isPending}
				innerRef={editorRef}
				variant="create"
			/>
		</div>
	)
}
