import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { IconType } from 'react-icons/lib'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib'
import { Button } from '@/components/ui'
import { useWorkspaceId } from '@/hooks'

const sidebarItemVariants = cva(
	'flex items-center justify-start gap-1.5 h-7 px-[18px] text-sm font-normal overflow-hidden',
	{
		variants: {
			variant: {
				default: 'text-[#f9edffcc]',
				active: 'text-[#481349] hover:text-[#481349] bg-white/90 hover:bg-white/90',
			},
			size: {},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

interface Props {
	id: string
	label: string
	icon: LucideIcon | IconType
	variant?: VariantProps<typeof sidebarItemVariants>['variant']
}

export const SidebarItem = ({ id, label, icon: Icon, variant }: Props) => {
	const workspaceId = useWorkspaceId()

	return (
		<Button variant='transparent' size='sm' className={cn(sidebarItemVariants({ variant }))} asChild>
			<Link href={`/workspace/${workspaceId}/channel/${id}`}>
				<Icon size={14} className='mr-1 shrink-0' />

				<span className='truncate text-sm'>{label}</span>
			</Link>
		</Button>
	)
}
