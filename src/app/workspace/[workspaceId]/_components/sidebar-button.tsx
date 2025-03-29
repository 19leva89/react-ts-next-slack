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
		<div className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group">
			<Button
				variant="transparent"
				className={cn(
					'size-9 group-hover:bg-accent/20! transition-colors ease-in-out duration-300',
					isActive && 'bg-accent/20',
				)}
			>
				<Icon
					size={20}
					className="size-5! text-white group-hover:scale-115 transition ease-in-out duration-300"
				/>
			</Button>

			<span className="text-[11px] text-white group-hover:text-accent transition-colors ease-in-out duration-300">
				{label}
			</span>
		</div>
	)
}
