import { format } from 'date-fns'

interface Props {
	name: string
	creationTime: number
}

export const ChannelHero = ({ name, creationTime }: Props) => {
	return (
		<div className="mt-22 mx-5 mb-4">
			<p className="flex items-center mb-2 text-2xl font-bold"># {name}</p>

			<p className="mb-4 font-normal text-slate-800">
				This channel was created on {format(creationTime, 'MMMM do, yyyy')}. This is the beginning of the{' '}
				<strong>{name}</strong> channel.
			</p>
		</div>
	)
}
