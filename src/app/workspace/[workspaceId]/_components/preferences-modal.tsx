import { toast } from 'sonner'
import { TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

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
} from '@/components/ui'
import { useConfirm, useWorkspaceId } from '@/hooks'
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace'
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace'

interface Props {
	open: boolean
	setOpen: (open: boolean) => void
	initialValue: string
}

export const PreferencesModal = ({ open, setOpen, initialValue }: Props) => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()

	const [value, setValue] = useState<string>(initialValue)
	const [editOpen, setEditOpen] = useState<boolean>(false)
	const [ConfirmDialog, confirm] = useConfirm('Are you sure?', 'This action cannot be undone!')

	const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace()
	const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace()

	const handleEdit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		updateWorkspace(
			{ id: workspaceId, name: value },
			{
				onSuccess: () => {
					toast.success('Workspace updated')
					setEditOpen(false)
				},
				onError: () => {
					toast.error('Failed to update workspace')
				},
			},
		)
	}

	const handleRemove = async () => {
		const ok = await confirm()

		if (!ok) return

		removeWorkspace(
			{ id: workspaceId },
			{
				onSuccess: () => {
					toast.success('Workspace removed')
					router.replace('/')
				},
				onError: () => {
					toast.error('Failed to remove workspace')
				},
			},
		)
	}

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent aria-describedby={undefined} className="p-0 bg-gray-50 overflow-hidden">
					<DialogHeader className="p-4 border-b bg-white">
						<DialogTitle>{value}</DialogTitle>

						<DialogDescription className="hidden" />
					</DialogHeader>

					<div className="flex flex-col gap-y-2 px-4 pb-4">
						<Dialog open={editOpen} onOpenChange={setEditOpen}>
							<DialogTrigger asChild>
								<div className="px-5 py-4 border rounded-lg bg-white cursor-pointer hover:bg-gray-50">
									<div className="flex items-center justify-between">
										<p className="text-sm font-semibold">Workspace name</p>

										<p className="text-sm text-[#1264a3] font-semibold hover:underline">Edit</p>
									</div>

									<p className="text-sm">{value}</p>
								</div>
							</DialogTrigger>

							<DialogContent aria-describedby={undefined}>
								<DialogHeader>
									<DialogTitle>Rename this workspace</DialogTitle>

									<DialogDescription className="hidden" />
								</DialogHeader>

								<form onSubmit={handleEdit} className="space-y-4">
									<Input
										value={value}
										disabled={isUpdatingWorkspace}
										onChange={(e) => setValue(e.target.value)}
										required
										autoFocus
										minLength={3}
										maxLength={80}
										placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
									/>

									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline" disabled={isUpdatingWorkspace}>
												Cancel
											</Button>
										</DialogClose>

										<Button loading={isUpdatingWorkspace} disabled={isUpdatingWorkspace}>
											Save
										</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>

						<button
							disabled={isRemovingWorkspace}
							onClick={handleRemove}
							className="flex items-center gap-x-2 px-5 py-4 border rounded-lg bg-white text-rose-600 cursor-pointer hover:bg-gray-50"
						>
							<TrashIcon size={16} />
							<p className="text-sm font-semibold">Delete workspace</p>
						</button>
					</div>
				</DialogContent>
			</Dialog>

			<ConfirmDialog />
		</>
	)
}
