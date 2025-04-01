import Quill from 'quill'
import dynamic from 'next/dynamic'
import { useRef } from 'react'

const Editor = dynamic(() => import('@/components/shared/editor'), { ssr: false })

interface Props {
	placeholder: string
}

export const ChatInput = ({ placeholder }: Props) => {
	const editorRef = useRef<Quill | null>(null)

	return (
		<div className="w-full px-5">
			<Editor
				onSubmit={() => {}}
				placeholder={placeholder}
				disabled={false}
				innerRef={editorRef}
				variant="create"
			/>
		</div>
	)
}
