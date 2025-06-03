import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui'

interface Props {
	name?: string
	image?: string
}

export const ConversationHero = ({ name = 'Member', image }: Props) => {
	const avatarFallback = name.charAt(0).toUpperCase()

	return (
		<div className='mx-5 mt-22 mb-4'>
			<div className='mb-2 flex items-center gap-x-1'>
				<Avatar className='mr-2 size-14 rounded-md'>
					<AvatarImage src={image} alt={name} className='rounded-md' />

					<AvatarFallback className='rounded-md bg-sky-500 text-3xl text-white'>
						{avatarFallback}
					</AvatarFallback>
				</Avatar>

				<span className='truncate text-2xl font-bold'>{name}</span>
			</div>

			<p className='mb-4 font-normal text-slate-800'>
				This conversation is just between you and <strong>{name}</strong>.
			</p>
		</div>
	)
}
