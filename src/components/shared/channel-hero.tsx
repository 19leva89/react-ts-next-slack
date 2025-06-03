import { format } from 'date-fns'

interface Props {
	name: string
	creationTime: number
}

export const ChannelHero = ({ name, creationTime }: Props) => {
	return (
		<div className='mx-5 mt-22 mb-4'>
			<p className='mb-2 flex items-center text-2xl font-bold'># {name}</p>

			<p className='mb-4 font-normal text-slate-800'>
				This channel was created on {format(creationTime, 'MMMM do, yyyy')}. This is the beginning of the{' '}
				<strong>{name}</strong> channel.
			</p>
		</div>
	)
}
