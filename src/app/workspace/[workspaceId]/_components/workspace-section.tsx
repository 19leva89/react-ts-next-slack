import { ReactNode } from 'react'
import { useToggle } from 'react-use'
import { PlusIcon } from 'lucide-react'
import { FaCaretRight } from 'react-icons/fa'

import { cn } from '@/lib'
import { Button } from '@/components/ui'
import { Hint } from '@/components/shared'

interface Props {
	children: ReactNode
	label: string
	hint: string
	onNew?: () => void
}

export const WorkspaceSection = ({ children, label, hint, onNew }: Props) => {
	const [on, toggle] = useToggle(true)

	return (
		<div className='mt-2 flex flex-col gap-0.5 px-2.5'>
			<div className='group flex items-center px-1.5'>
				<Button
					variant='transparent'
					onClick={toggle}
					className='size-6 shrink-0 p-0.5 text-sm text-[#f9edffcc]'
				>
					<FaCaretRight
						size={16}
						className={cn('transition-transform duration-300 ease-in-out', on && 'rotate-90')}
					/>
				</Button>

				<Button
					variant='transparent'
					size='sm'
					className='group h-7 justify-start overflow-hidden px-1.5 text-sm text-[#f9edffcc]'
				>
					<span className='truncate'>{label}</span>
				</Button>

				{onNew && (
					<Hint label={hint} side='top'>
						<Button
							variant='transparent'
							size='iconSm'
							onClick={onNew}
							className='ml-auto size-6 shrink-0 p-0.5 text-sm text-[#f9edffcc] opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100'
						>
							<PlusIcon size={20} />
						</Button>
					</Hint>
				)}
			</div>

			{on && children}
		</div>
	)
}
