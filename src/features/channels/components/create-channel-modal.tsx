'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useState } from 'react'

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input,
} from '@/components/ui'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCreateChannel } from '../api/use-create-channel'
import { useCreateChannelModal } from '../store/use-create-channel-modal'

export const CreateChannelModal = () => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()

	const { mutate, isPending } = useCreateChannel()

	const [name, setName] = useState<string>('')
	const [open, setOpen] = useCreateChannelModal()

	const handleClose = () => {
		setName('')

		setOpen(false)
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await mutate(
			{ name: name.trim(), workspaceId },
			{
				onSuccess(id) {
					toast.success('Channel created')
					router.push(`/workspace/${workspaceId}/channel/${id}`)
					handleClose()
				},
				onError: () => {
					toast.error('Failed to create channel')
				},
				onSettled() {
					// Reset form
				},
			},
		)
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, '-').toLowerCase()

		setName(value)
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Add a channel</DialogTitle>

					<DialogDescription className="hidden" />
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						value={name}
						onChange={handleChange}
						disabled={isPending}
						required
						autoFocus
						minLength={3}
						maxLength={80}
						placeholder="Channel name e.g. 'plan-budget'"
					/>

					<div className="flex justify-end">
						<Button type="submit" disabled={!name.trim()}>
							Create
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
