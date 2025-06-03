import {
	AlertTriangleIcon,
	HashIcon,
	LoaderIcon,
	MessageSquareTextIcon,
	SendHorizontalIcon,
} from 'lucide-react'

import {
	SidebarItem,
	UserItem,
	WorkspaceHeader,
	WorkspaceSection,
} from '@/app/workspace/[workspaceId]/_components'
import { useChannelId, useMemberId, useWorkspaceId } from '@/hooks'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'

export const WorkspaceSidebar = () => {
	const memberId = useMemberId()
	const channelId = useChannelId()
	const workspaceId = useWorkspaceId()

	const [_open, setOpen] = useCreateChannelModal()

	const { data: members } = useGetMembers({ workspaceId })
	const { data: channels } = useGetChannels({ workspaceId })
	const { data: member, isLoading: loadingMember } = useCurrentMember({ workspaceId })
	const { data: workspace, isLoading: loadingWorkspace } = useGetWorkspace({ id: workspaceId })

	if (loadingMember || loadingWorkspace) {
		return (
			<div className='flex h-full flex-col items-center justify-center bg-[#5e2c5f]'>
				<LoaderIcon size={20} className='animate-spin text-white' />
			</div>
		)
	}

	if (!member || !workspace) {
		return (
			<div className='flex h-full flex-col items-center justify-center gap-y-2 bg-[#5e2c5f]'>
				<AlertTriangleIcon size={20} className='text-white' />

				<p className='text-sm text-white'>Workspace not found</p>
			</div>
		)
	}

	return (
		<div className='flex h-full flex-col bg-[#5e2c5f]'>
			<WorkspaceHeader workspace={workspace} isOwner={member.role === 'owner'} />

			<div className='mt-3 flex flex-col gap-0.5 px-2.5'>
				<SidebarItem id='threads' label='Threads' icon={MessageSquareTextIcon} />

				<SidebarItem id='drafts' label='Drafts & Sent' icon={SendHorizontalIcon} />
			</div>

			<WorkspaceSection
				label='Channels'
				hint='New channels'
				onNew={member.role === 'owner' ? () => setOpen(true) : undefined}
			>
				{channels?.map((item) => (
					<SidebarItem
						key={item._id}
						id={item._id}
						label={item.name}
						icon={HashIcon}
						variant={channelId === item._id ? 'active' : 'default'}
					/>
				))}
			</WorkspaceSection>

			<WorkspaceSection label='Direct messages' hint='New direct messages' onNew={() => {}}>
				{members?.map((item) => (
					<UserItem
						key={item._id}
						id={item._id}
						label={item.user.name}
						image={item.user.image}
						variant={item._id === memberId ? 'active' : 'default'}
					/>
				))}
			</WorkspaceSection>
		</div>
	)
}
