import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'

interface Props {
	name?: string
	image?: string
}

export const ConversationHero = ({ name = 'Member', image }: Props) => {
	const avatarFallback = name.charAt(0).toUpperCase()

	return (
		<div className="mt-22 mx-5 mb-4">
			<div className="flex items-center gap-x-1 mb-2">
				<Avatar className="size-14 rounded-md mr-2">
					<AvatarImage src={image} alt={name} className="rounded-md" />

					<AvatarFallback className="rounded-md bg-sky-500 text-white text-3xl">
						{avatarFallback}
					</AvatarFallback>
				</Avatar>

				<span className="text-2xl font-bold truncate">{name}</span>
			</div>

			<p className="mb-4 font-normal text-slate-800">
				This conversation is just between you and <strong>{name}</strong>.
			</p>
		</div>
	)
}
