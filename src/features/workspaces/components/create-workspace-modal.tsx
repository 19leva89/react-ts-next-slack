'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input,
} from '@/components/ui'
import { useCreateWorkspace } from '../api/use-create-workspace'
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal'

export const CreateWorkspaceModal = () => {
	const router = useRouter()

	const { mutate, isPending } = useCreateWorkspace()

	const [name, setName] = useState<string>('')
	const [open, setOpen] = useCreateWorkspaceModal()

	const handleClose = () => {
		setName('')

		setOpen(false)
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await mutate(
			{ name: name.trim() },
			{
				onSuccess(data) {
					toast.success('Workspace created')
					router.push(`/workspace/${data}`)
					handleClose()
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
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Add a workspace</DialogTitle>

					<DialogDescription className='hidden' />
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isPending}
						required
						autoFocus
						minLength={3}
						placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
					/>

					<div className='flex justify-end'>
						<Button type='submit' disabled={!name.trim()}>
							Create
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
