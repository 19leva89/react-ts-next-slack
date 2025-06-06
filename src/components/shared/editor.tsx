import Quill from 'quill'
import Image from 'next/image'
import { MdSend } from 'react-icons/md'
import { PiTextAa } from 'react-icons/pi'
import type { Delta, Op, QuillOptions } from 'quill'
import { ImageIcon, SmileIcon, XIcon } from 'lucide-react'
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib'
import { Button } from '@/components/ui'
import { EmojiPopover, Hint } from '@/components/shared'

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
	const [image, setImage] = useState<File | null>(null)
	const [isToolbarVisible, setToolbarVisible] = useState<boolean>(false)

	const submitRef = useRef(onSubmit)
	const disabledRef = useRef(disabled)
	const placeholderRef = useRef(placeholder)
	const quillRef = useRef<Quill | null>(null)
	const defaultValueRef = useRef(defaultValue)
	const imageRef = useRef<HTMLInputElement>(null)
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
								const text = quill.getText()
								const addedImage = imageRef.current?.files?.[0] || null

								const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length === 0
								if (isEmpty) return

								const body = JSON.stringify(quill.getContents())
								submitRef.current({ body, image: addedImage })
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

		const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')
		if (toolbarElement) {
			toolbarElement.classList.add('hidden')
		}

		setToolbarVisible(false)

		if (innerRef) {
			innerRef.current = quill
		}

		quill.setContents(defaultValueRef.current)

		const container = containerRef.current

		setText(quill.getText())

		quill.on(Quill.events.TEXT_CHANGE, () => {
			setText(quill.getText())
		})

		return () => {
			quill.off(Quill.events.TEXT_CHANGE)

			if (container) {
				container.innerHTML = ''
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

			if (!toolbarElement.classList.contains('hidden')) {
				quillRef.current?.focus()
			}
		}
	}

	const onEmojiSelect = (emojiValue: string) => {
		const quill = quillRef.current

		if (quill) {
			quill.insertText(quill.getSelection()?.index || 0, emojiValue)
		}
	}

	const onSubmitClick = () => {
		onSubmit({ body: JSON.stringify(quillRef.current?.getContents()), image })
	}

	// Check if the editor is empty
	const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0

	return (
		<div className='flex flex-col'>
			<input
				type='file'
				ref={imageRef}
				accept='image/*'
				onChange={(e) => setImage(e.target.files![0])}
				className='hidden'
			/>

			<div
				className={cn(
					'flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm',
					disabled && 'pointer-events-none opacity-50',
				)}
			>
				<div ref={containerRef} className='ql-custom h-full' />

				{!!image && (
					<div className='p-2'>
						<div className='group/image relative flex size-[62px] items-center justify-center'>
							<Hint label='Remove image' side='top'>
								<button
									onClick={() => {
										setImage(null)
										imageRef.current!.value = ''
									}}
									className='absolute -top-2.5 -right-2.5 z-4 hidden size-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-black/70 text-white group-hover/image:flex hover:bg-black'
								>
									<XIcon size={14} />
								</button>
							</Hint>

							<Image
								src={URL.createObjectURL(image)}
								alt='Uploaded image'
								fill
								className='overflow-hidden rounded-xl border object-cover'
							/>
						</div>
					</div>
				)}

				<div className='z-5 flex px-2 pb-2'>
					<Hint label={isToolbarVisible ? 'Hide formatting' : 'Show formatting'} side='top'>
						<Button variant='ghost' size='iconSm' disabled={disabled} onClick={toggleToolbar}>
							<PiTextAa size={16} />
						</Button>
					</Hint>

					<EmojiPopover onEmojiSelect={onEmojiSelect}>
						<Button variant='ghost' size='iconSm' disabled={disabled}>
							<SmileIcon size={16} />
						</Button>
					</EmojiPopover>

					{variant === 'create' && (
						<Hint label='Image' side='top'>
							<Button
								variant='ghost'
								size='iconSm'
								disabled={disabled}
								onClick={() => imageRef.current?.click()}
							>
								<ImageIcon size={16} />
							</Button>
						</Hint>
					)}

					{variant === 'update' && (
						<div className='ml-auto flex items-center gap-x-2'>
							<Button variant='outline' size='sm' disabled={disabled} onClick={onCancel}>
								Cancel
							</Button>

							<Button
								size='sm'
								disabled={disabled || isEmpty}
								onClick={onSubmitClick}
								className='bg-[#007a5a] text-white hover:bg-[#007a5a]/80'
							>
								Save
							</Button>
						</div>
					)}

					{variant === 'create' && (
						<Button
							size='iconSm'
							disabled={disabled || isEmpty}
							onClick={onSubmitClick}
							className={cn(
								'ml-auto',
								isEmpty
									? 'bg-white text-muted-foreground hover:bg-white'
									: 'bg-[#007a5a] text-white hover:bg-[#007a5a]/80',
							)}
						>
							<MdSend size={16} />
						</Button>
					)}
				</div>
			</div>

			{variant === 'create' && (
				<div
					className={cn(
						'flex justify-end p-2 text-[10px] text-muted-foreground opacity-0 transition-opacity duration-300 ease-in-out',
						!isEmpty && 'opacity-100',
					)}
				>
					<p>
						<strong>Shift + Enter</strong> to create a new line
					</p>
				</div>
			)}
		</div>
	)
}

export default Editor
