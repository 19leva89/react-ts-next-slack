import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui'

interface Props {
	url: string | null | undefined
}

export const Thumbnail = ({ url }: Props) => {
	if (!url) return null

	return (
		<Dialog>
			<DialogTrigger aria-describedby={undefined}>
				<div className='relative my-2 max-w-90 cursor-zoom-in overflow-hidden rounded-lg border'>
					<img src={url} alt='Message image' className='size-full rounded-md object-cover' />
				</div>
			</DialogTrigger>

			<DialogContent className='max-w-200 border-none bg-transparent p-1 shadow-none'>
				<DialogTitle className='hidden' />

				<DialogDescription className='hidden' />

				<img src={url} alt='Message image' className='size-full rounded-md object-cover' />
			</DialogContent>
		</Dialog>
	)
}
