import {
	AlertTriangleIcon,
	HashIcon,
	LoaderIcon,
	MessageSquareTextIcon,
	SendHorizontalIcon,
} from 'lucide-react'

import { UserItem } from './user-item'
import { SidebarItem } from './sidebar-item'
import { WorkspaceHeader } from './workspace-header'
import { WorkspaceSection } from './workspace-section'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'

export const WorkspaceSidebar = () => {
	const workspaceId = useWorkspaceId()

	const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
	const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId })
	const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })

	if (memberLoading || workspaceLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full bg-[#5e2c5f]">
				<LoaderIcon size={20} className="text-white animate-spin" />
			</div>
		)
	}

	if (!member || !workspace) {
		return (
			<div className="flex flex-col items-center justify-center gap-y-2 h-full bg-[#5e2c5f]">
				<AlertTriangleIcon size={20} className="text-white" />

				<p className="text-sm text-white">Workspace not found</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full bg-[#5e2c5f]">
			<WorkspaceHeader workspace={workspace} isOwner={member.role === 'owner'} />

			<div className="flex flex-col gap-1 px-2.5 mt-3">
				<SidebarItem id="threads" label="Threads" icon={MessageSquareTextIcon} variant="active" />

				<SidebarItem id="drafts" label="Drafts & Sent" icon={SendHorizontalIcon} variant="default" />
			</div>

			<WorkspaceSection label="Channels" hint="New channels" onNew={() => {}}>
				{channels?.map((item) => (
					<SidebarItem key={item._id} id={item._id} label={item.name} icon={HashIcon} />
				))}
			</WorkspaceSection>

			<WorkspaceSection label="Direct messages" hint="New direct messages" onNew={() => {}}>
				{members?.map((item) => (
					<UserItem key={item._id} id={item._id} label={item.user.name} image={item.user.image} />
				))}
			</WorkspaceSection>
		</div>
	)
}
