import Quill from 'quill'
import { MdSend } from 'react-icons/md'
import { PiTextAa } from 'react-icons/pi'
import { ImageIcon, SmileIcon } from 'lucide-react'
import type { Delta, Op, QuillOptions } from 'quill'
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib'
import { Button } from '@/components/ui'
import { Hint } from '@/components/shared'

import 'quill/dist/quill.snow.css'

type EditorValue = {
	image: File | null
	body: string
}

interface Props {
	onSubmit: ({ image, body }: EditorValue) => void
	onCancel?: () => void
	placeholder?: string
	defaultValue?: Delta | Op[]
	disabled?: boolean
	innerRef?: RefObject<Quill | null>
	variant?: 'create' | 'update'
}

const Editor = ({
	onSubmit,
	onCancel,
	placeholder = 'Write something...',
	defaultValue = [],
	disabled = false,
	innerRef,
	variant = 'create',
}: Props) => {
	const [text, setText] = useState<string>('')
	const [isToolbarVisible, setToolbarVisible] = useState<boolean>(true)

	const submitRef = useRef(onSubmit)
	const disabledRef = useRef(disabled)
	const placeholderRef = useRef(placeholder)
	const quillRef = useRef<Quill | null>(null)
	const defaultValueRef = useRef(defaultValue)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// Ensure this runs only on client side
		if (typeof window === 'undefined' || !containerRef.current) return

		const editorContainer = containerRef.current!.appendChild(
			containerRef.current!.ownerDocument.createElement('div'),
		)

		const options: QuillOptions = {
			theme: 'snow',
			placeholder: placeholderRef.current,
			modules: {
				toolbar: [['bold', 'italic', 'strike'], ['link'], [{ list: 'ordered' }, { list: 'bullet' }]],
				keyboard: {
					bindings: {
						enter: {
							key: 'Enter',
							handler: () => {
								//TODO Submit form
							},
						},
						shift_enter: {
							key: 'Enter',
							shiftKey: true,
							handler: () => {
								quill.insertText(quill.getSelection()?.index || 0, '\n')
							},
						},
					},
				},
			},
		}

		const quill = new Quill(editorContainer, options)
		quillRef.current = quill
		quillRef.current.focus()

		if (innerRef) {
			innerRef.current = quill
		}

		quill.setContents(defaultValueRef.current)
		setText(quill.getText())

		quill.on(Quill.events.TEXT_CHANGE, () => {
			setText(quill.getText())
		})

		return () => {
			quill.off(Quill.events.TEXT_CHANGE)

			if (containerRef.current) {
				containerRef.current.innerHTML = ''
			}

			if (quillRef.current) {
				quillRef.current = null
			}

			if (innerRef) {
				innerRef.current = null
			}
		}
	}, [innerRef])

	useLayoutEffect(() => {
		submitRef.current = onSubmit
		disabledRef.current = disabled
		placeholderRef.current = placeholder
		defaultValueRef.current = defaultValue
	})

	const toggleToolbar = () => {
		setToolbarVisible((current) => !current)

		const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')

		if (toolbarElement) {
			toolbarElement.classList.toggle('hidden')
		}
	}

	// Check if the editor is empty
	const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0

	return (
		<div className="flex flex-col">
			<div className="flex flex-col border border-slate-200 rounded-md bg-white overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition">
				<div ref={containerRef} className="h-full ql-custom" />

				<div className="z-5 flex px-2 pb-2">
					<Hint label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'} side="top">
						<Button variant="ghost" size="iconSm" disabled={disabled} onClick={toggleToolbar}>
							<PiTextAa size={16} />
						</Button>
					</Hint>

					<Hint label="Emoji" side="top">
						<Button variant="ghost" size="iconSm" disabled={disabled} onClick={() => {}}>
							<SmileIcon size={16} />
						</Button>
					</Hint>

					{variant === 'create' && (
						<Hint label="Image" side="top">
							<Button variant="ghost" size="iconSm" disabled={disabled} onClick={() => {}}>
								<ImageIcon size={16} />
							</Button>
						</Hint>
					)}

					{variant === 'update' && (
						<div className="flex items-center gap-x-2 ml-auto">
							<Button variant="outline" size="sm" disabled={disabled} onClick={() => {}}>
								Cancel
							</Button>

							<Button
								size="sm"
								disabled={disabled || isEmpty}
								onClick={() => {}}
								className="text-white bg-[#007a5a] hover:bg-[#007a5a]/80"
							>
								Save
							</Button>
						</div>
					)}

					{variant === 'create' && (
						<Button
							size="iconSm"
							disabled={disabled || isEmpty}
							onClick={() => {}}
							className={cn(
								'ml-auto',
								isEmpty
									? 'text-muted-foreground bg-white hover:bg-white'
									: 'text-white bg-[#007a5a] hover:bg-[#007a5a]/80',
							)}
						>
							<MdSend size={16} />
						</Button>
					)}
				</div>
			</div>

			<div className="flex justify-end p-2 text-[10px] text-muted-foreground">
				<p>
					<strong>Shift + Enter</strong> to create a new line
				</p>
			</div>
		</div>
	)
}

export default Editor
