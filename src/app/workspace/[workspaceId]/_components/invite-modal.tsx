import { toast } from 'sonner'
import { CopyIcon, RefreshCcwIcon } from 'lucide-react'

import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Separator,
} from '@/components/ui'
import { useConfirm, useWorkspaceId } from '@/hooks'
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code'

interface Props {
	open: boolean
	setOpen: (open: boolean) => void
	name: string
	joinCode: string
}

export const InviteModal = ({ open, setOpen, name, joinCode }: Props) => {
	const workspaceId = useWorkspaceId()

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure?',
		'This will deactivate the current invite code and generate a new one!',
	)

	const { mutate, isPending } = useNewJoinCode()

	const handleCopy = () => {
		const inviteLink = `${window.location.origin}/join/${workspaceId}`

		navigator.clipboard.writeText(inviteLink).then(() => {
			toast.success('Invite link copied to clipboard')
		})
	}

	const handleNewCode = async () => {
		const ok = await confirm()

		if (!ok) return

		mutate(
			{ workspaceId },
			{
				onSuccess: () => {
					toast.success('Invite code regenerated')
				},
				onError: () => {
					toast.error('Failed to regenerate invite code')
				},
			},
		)
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className='gap-0 overflow-hidden bg-gray-50 p-0'>
					<DialogHeader className='bg-white p-4'>
						<DialogTitle>Invite people to {name}</DialogTitle>

						<DialogDescription>Use the code below to invite people to your workspace</DialogDescription>
					</DialogHeader>

					<Separator />

					<div className='flex flex-col items-center justify-center gap-2 px-10 py-16'>
						<p className='text-4xl font-bold tracking-widest uppercase'>{joinCode}</p>

						<Button variant='ghost' size='sm' onClick={handleCopy}>
							Copy link
							<CopyIcon size={16} className='ml-2' />
						</Button>
					</div>

					<div className='flex w-full items-center justify-between p-4'>
						<Button variant='outline' disabled={isPending} onClick={handleNewCode}>
							New code
							<RefreshCcwIcon size={16} className='ml-2' />
						</Button>

						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>

			<ConfirmDialog />
		</>
	)
}
