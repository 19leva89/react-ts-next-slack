'use client'

import { Router } from 'next/router'
import { useCreateWorkspace } from '../api/use-create-workspace'
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input } from '@/components/ui'

export const CreateWorkspaceModal = () => {
	const [open, setOpen] = useCreateWorkspaceModal()

	const { mutate } = useCreateWorkspace()

	const handeClose = () => {
		setOpen(false)

		// TODO: Clear form
	}

	const handleSubmit = async () => {
		const data = await mutate(
			{ name: 'Workspace 1' },
			{
				onSuccess(data) {
					router.push(`/workspaces/${data}`)
				},
				onError: () => {
					// Show toast error
				},
				onSettled() {
					// Reset form
				},
			},
		)
	}

	return (
		<Dialog open={open} onOpenChange={handeClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a workspace</DialogTitle>
				</DialogHeader>

				<form className="space-y-4">
					<Input
						value=""
						disabled={false}
						required
						autoFocus
						minLength={3}
						placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
					/>

					<div className="flex justify-end">
						<Button disabled={false}>Create</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
