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
			<div className="flex items-center h-1/18 px-4 bg-white overflow-hidden">
				<Button
					variant="ghost"
					size="sm"
					onClick={onClick}
					className="w-auto px-2 text-lg font-semibold overflow-hidden"
				>
					<Avatar className="size-6 rounded-md mr-2">
						<AvatarImage src={memberImage} alt={memberName} className="rounded-md" />

						<AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
							{avatarFallback}
						</AvatarFallback>
					</Avatar>

					<span className="text-sm truncate">{memberName}</span>

					<FaChevronDown size={10} className="size-2.5 ml-2" />
				</Button>
			</div>

			<Separator />
		</>
	)
}
