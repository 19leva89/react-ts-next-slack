import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib'
import { useWorkspaceId } from '@/hooks'
import { Id } from '../../../../../convex/_generated/dataModel'
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui'

const userItemVariants = cva(
	'flex items-center justify-start gap-1.5 h-7 px-4 text-sm font-normal overflow-hidden',
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
	id: Id<'members'>
	label?: string
	image?: string
	variant?: VariantProps<typeof userItemVariants>['variant']
}

export const UserItem = ({ id, label = 'Member', image, variant }: Props) => {
	const workspaceId = useWorkspaceId()
	const avatarFallback = label.charAt(0).toUpperCase()

	return (
		<Button variant='transparent' size='sm' className={cn(userItemVariants({ variant }))} asChild>
			<Link href={`/workspace/${workspaceId}/member/${id}`}>
				<Avatar className='mr-1 size-5 rounded-md'>
					<AvatarImage src={image} alt={label} className='rounded-md' />

					<AvatarFallback className='rounded-md bg-sky-500 text-xs text-white'>
						{avatarFallback}
					</AvatarFallback>
				</Avatar>

				<span className='truncate text-sm'>{label}</span>
			</Link>
		</Button>
	)
}
