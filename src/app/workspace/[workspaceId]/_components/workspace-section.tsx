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
		<div className="flex flex-col px-2.5 mt-2">
			<div className="flex items-center px-1.5 group">
				<Button
					variant="transparent"
					onClick={toggle}
					className="size-6 p-0.5 text-sm text-[#f9edffcc] shrink-0"
				>
					<FaCaretRight
						size={16}
						className={cn('transition-transform ease-in-out duration-300', on && 'rotate-90')}
					/>
				</Button>

				<Button
					variant="transparent"
					size="sm"
					className="justify-start h-[28px] px-1.5 text-sm text-[#f9edffcc] overflow-hidden group"
				>
					<span className="truncate">{label}</span>
				</Button>

				{onNew && (
					<Hint label={hint} side="top">
						<Button
							variant="transparent"
							size="iconSm"
							onClick={onNew}
							className="size-6 ml-auto p-0.5 text-sm text-[#f9edffcc] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300"
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
