import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal'

export const WorkspaceSwitcher = () => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()

	const [_open, setOpen] = useCreateWorkspaceModal()

	const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces()
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })

	const filteredWorkspaces = workspaces?.filter((workspace) => workspace._id !== workspaceId)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					loading={workspaceLoading}
					className="relative size-9 overflow-hidden bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 font-semibold text-xl transition-colors ease-in-out duration-300"
				>
					{workspace?.name.charAt(0).toUpperCase()}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent side="bottom" align="start" className="w-64">
				<DropdownMenuItem
					onClick={() => router.push(`/workspace/${workspaceId}`)}
					className="flex-col items-start justify-start gap-0 capitalize cursor-pointer"
				>
					<p className="truncate w-full">{workspace?.name}</p>

					<span className="text-xs text-muted-foreground normal-case">Active workspace</span>
				</DropdownMenuItem>

				{filteredWorkspaces?.map((workspace) => (
					<DropdownMenuItem
						key={workspace._id}
						onClick={() => router.push(`/workspace/${workspace._id}`)}
						className="capitalize cursor-pointer"
					>
						<div className="relative flex items-center justify-center shrink-0 size-9 mr-2 overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md">
							{workspace.name.charAt(0).toUpperCase()}
						</div>

						<p className="truncate">{workspace.name}</p>
					</DropdownMenuItem>
				))}

				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={() => setOpen(true)} className="cursor-pointer">
					<div className="relative flex items-center justify-center size-9 mr-2 overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-xl rounded-md">
						<PlusIcon />
					</div>
					Create a new workspace
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
