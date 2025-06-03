import { LucideIcon } from 'lucide-react'
import { IconType } from 'react-icons/lib'

import { cn } from '@/lib'
import { Button } from '@/components/ui'

interface Props {
	icon: LucideIcon | IconType
	label: string
	isActive?: boolean
}

export const SidebarButton = ({ icon: Icon, label, isActive }: Props) => {
	return (
		<div className='group flex cursor-pointer flex-col items-center justify-center gap-y-0.5'>
			<Button
				variant='transparent'
				className={cn(
					'size-9 transition-colors duration-300 ease-in-out group-hover:bg-accent/20!',
					isActive && 'bg-accent/20',
				)}
			>
				<Icon
					size={20}
					className='size-5! text-white transition duration-300 ease-in-out group-hover:scale-115'
				/>
			</Button>

			<span className='text-[11px] text-white transition-colors duration-300 ease-in-out group-hover:text-accent'>
				{label}
			</span>
		</div>
	)
}
