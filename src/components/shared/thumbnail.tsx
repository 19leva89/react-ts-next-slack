import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui'

interface Props {
	url: string | null | undefined
}

export const Thumbnail = ({ url }: Props) => {
	if (!url) return null

	return (
		<Dialog>
			<DialogTrigger aria-describedby={undefined}>
				<div className="relative max-w-90 my-2 border rounded-lg overflow-hidden cursor-zoom-in">
					<img src={url} alt="Message image" className="size-full rounded-md object-cover" />
				</div>
			</DialogTrigger>

			<DialogContent className="max-w-200 p-0 border-none bg-transparent shadow-none">
				<DialogTitle className="hidden" />

				<DialogDescription className="hidden" />

				<img src={url} alt="Message image" className="size-full rounded-md object-cover" />
			</DialogContent>
		</Dialog>
	)
}
