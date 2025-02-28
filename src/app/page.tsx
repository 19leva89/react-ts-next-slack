'use client'

import { useEffect, useMemo } from 'react'

import { UserButton } from '@/features/auth/components/user-button'
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal'

const HomePage = () => {
	const { data, isLoading } = useGetWorkspaces()
	const [open, setOpen] = useCreateWorkspaceModal()

	const workspaceId = useMemo(() => data?.[0]?._id, [data])

	useEffect(() => {
		if (isLoading) return

		if (workspaceId) {
			console.log('Redirecting to workspace', workspaceId)
		} else if (!open) {
			setOpen(true)
		}
	}, [workspaceId, isLoading, open, setOpen])

	return (
		<div>
			<UserButton />
		</div>
	)
}

export default HomePage
