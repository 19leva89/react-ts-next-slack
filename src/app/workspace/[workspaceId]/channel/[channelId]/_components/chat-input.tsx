import Quill from 'quill'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { useRef, useState } from 'react'

import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCreateMessage } from '@/features/messages/api/use-create-message'

const Editor = dynamic(() => import('@/components/shared/editor'), { ssr: false })

type EditorValue = {
	body: string
	image: File | null
}
interface Props {
	placeholder: string
}

export const ChatInput = ({ placeholder }: Props) => {
	const channelId = useChannelId()
	const workspaceId = useWorkspaceId()
	const editorRef = useRef<Quill | null>(null)

	const [editorKey, setEditorKey] = useState<number>(0)
	const [isPending, setIsPending] = useState<boolean>(false)

	const { mutate: createMessage } = useCreateMessage()

	const handleSubmit = async ({ body, image }: EditorValue) => {
		try {
			setIsPending(true)

			await createMessage({ body, workspaceId, channelId }, { throwOnError: true })

			setEditorKey((prevKey) => prevKey + 1)
		} catch (error) {
			toast.error('Failed to create message')
		} finally {
			setIsPending(false)
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
