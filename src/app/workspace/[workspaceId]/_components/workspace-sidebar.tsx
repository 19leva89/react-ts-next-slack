import { AlertTriangleIcon, LoaderIcon } from 'lucide-react'

import { WorkspaceHeader } from './workspace-header'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'

export const WorkspaceSidebar = () => {
	const workspaceId = useWorkspaceId()

	const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
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
		</div>
	)
}
