'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { LoaderIcon, TriangleAlertIcon } from 'lucide-react'

import { useWorkspaceId } from '@/hooks'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'

const WorkspaceIdPage = () => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()

	const [open, setOpen] = useCreateChannelModal()

	const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
	const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })

	const channelId = useMemo(() => channels?.[0]?._id, [channels])
	const isOwner = useMemo(() => member?.role === 'owner', [member?.role])

	useEffect(() => {
		if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return

		if (channelId) {
			router.push(`/workspace/${workspaceId}/channel/${channelId}`)
		} else if (!open && isOwner) {
			setOpen(true)
		}
	}, [
		workspace,
		workspaceId,
		workspaceLoading,
		channelId,
		channelsLoading,
		isOwner,
		member,
		memberLoading,
		open,
		setOpen,
		router,
	])

	if (workspaceLoading || channelsLoading || memberLoading) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center h-full">
				<LoaderIcon size={20} className="text-muted-foreground animate-spin" />
			</div>
		)
	}

	if (!workspace || !member) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-2 h-full">
				<TriangleAlertIcon size={20} className="text-muted-foreground" />

				<span className="text-sm text-muted-foreground">Workspace not found</span>
			</div>
		)
	}

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-2 h-full">
			<TriangleAlertIcon size={20} className="text-muted-foreground" />

			<span className="text-sm text-muted-foreground">Channel not found</span>
		</div>
	)
}

export default WorkspaceIdPage
