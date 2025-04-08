import { toast } from 'sonner'
import { TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FaChevronDown } from 'react-icons/fa'
import { ChangeEvent, FormEvent, useState } from 'react'

import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Separator,
} from '@/components/ui'
import { useChannelId, useConfirm, useWorkspaceId } from '@/hooks'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel'
import { useUpdateChannel } from '@/features/channels/api/use-update-channel'

interface Props {
	title: string
}

export const Header = ({ title }: Props) => {
	const router = useRouter()
	const channelId = useChannelId()
	const workspaceId = useWorkspaceId()

	const [value, setValue] = useState<string>(title)
	const [editOpen, setEditOpen] = useState<boolean>(false)
	const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This action cannot be undone!')

	const { data: member } = useCurrentMember({ workspaceId })
	const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel()
	const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel()

	const handleEditOpen = (value: boolean) => {
		if (member?.role !== 'owner') return

		setEditOpen(value)
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, '-').toLowerCase()

		setValue(value)
	}

	const handleEdit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		updateChannel(
			{ id: channelId, name: value },
			{
				onSuccess: () => {
					toast.success('Channel updated')
					setEditOpen(false)
				},
				onError: () => {
					toast.error('Failed to update channel')
				},
			},
		)
	}

	const handleRemove = async () => {
		const ok = await confirm()

		if (!ok) return

		removeChannel(
			{ id: channelId },
			{
				onSuccess: () => {
					toast.success('Channel removed')
					router.push(`/workspace/${workspaceId}`)
				},
				onError: () => {
					toast.error('Failed to remove channel')
				},
			},
		)
	}

	return (
		<>
			<div className="flex items-center h-1/18 px-4 bg-white overflow-hidden">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="ghost" size="sm" className="w-auto px-2 text-lg font-semibold overflow-auto">
							<span className="truncate"># {title}</span>

							<FaChevronDown size={10} className="size-2.5 ml-2" />
						</Button>
					</DialogTrigger>

					<DialogContent aria-describedby={undefined} className="gap-0 p-0 bg-gray-50 overflow-hidden">
						<DialogHeader className="p-4 bg-white">
							<DialogTitle># {title}</DialogTitle>

							<DialogDescription className="hidden" />
						</DialogHeader>

						<Separator />

						<div className="flex flex-col gap-2 p-4">
							<Dialog open={editOpen} onOpenChange={handleEditOpen}>
								<DialogTrigger asChild>
									<div className="px-5 py-4 border rounded-lg bg-white cursor-pointer hover:bg-gray-50">
										<div className="flex items-center justify-between">
											<p className="text-sm font-semibold">Channel name</p>

											{member?.role === 'owner' && (
												<p className="text-sm text-[#1264a3] font-semibold hover:underline">Edit</p>
											)}
										</div>

										<p className="text-sm"># {title}</p>
									</div>
								</DialogTrigger>

								<DialogContent aria-describedby={undefined}>
									<DialogHeader>
										<DialogTitle>Rename this channel</DialogTitle>

										<DialogDescription className="hidden" />
									</DialogHeader>

									<form onSubmit={handleEdit} className="space-y-4">
										<Input
											value={value}
											disabled={isUpdatingChannel}
											onChange={handleChange}
											required
											autoFocus
											minLength={3}
											maxLength={80}
											placeholder="Channel name e.g. 'plan-budget'"
										/>

										<DialogFooter>
											<DialogClose asChild>
												<Button variant="outline" disabled={isUpdatingChannel}>
													Cancel
												</Button>
											</DialogClose>

											<Button loading={isUpdatingChannel} disabled={isUpdatingChannel}>
												Save
											</Button>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>

							{member?.role === 'owner' && (
								<button
									disabled={isRemovingChannel}
									onClick={handleRemove}
									className="flex items-center gap-x-2 px-5 py-4 border rounded-lg bg-white text-rose-600 cursor-pointer hover:bg-gray-50"
								>
									<TrashIcon size={16} />
									<p className="text-sm font-semibold">Delete channel</p>
								</button>
							)}
						</div>
					</DialogContent>
				</Dialog>

				<ConfirmDialog />
			</div>

			<Separator />
		</>
	)
}
