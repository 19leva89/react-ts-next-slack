import { FaChevronDown } from 'react-icons/fa'

import { Avatar, AvatarFallback, AvatarImage, Button, Separator } from '@/components/ui'

interface Props {
	memberName?: string
	memberImage?: string
	onClick?: () => void
}

export const Header = ({ memberName = 'Member', memberImage, onClick }: Props) => {
	const avatarFallback = memberName.charAt(0).toUpperCase()

	return (
		<>
			<div className='flex h-1/18 items-center overflow-hidden bg-white px-4'>
				<Button
					variant='ghost'
					size='sm'
					onClick={onClick}
					className='w-auto overflow-hidden px-2 text-lg font-semibold'
				>
					<Avatar className='mr-2 size-6 rounded-md'>
						<AvatarImage src={memberImage} alt={memberName} className='rounded-md' />

						<AvatarFallback className='rounded-md bg-sky-500 text-xs text-white'>
							{avatarFallback}
						</AvatarFallback>
					</Avatar>

					<span className='truncate text-sm'>{memberName}</span>

					<FaChevronDown size={10} className='ml-2 size-2.5' />
				</Button>
			</div>

			<Separator />
		</>
	)
}
