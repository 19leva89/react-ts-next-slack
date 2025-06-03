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
import { useWorkspaceId } from '@/hooks'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal'

export const WorkspaceSwitcher = () => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()

	const [_open, setOpen] = useCreateWorkspaceModal()

	const { data: workspaces } = useGetWorkspaces()
	const { data: workspace, isLoading: loadingWorkspace } = useGetWorkspace({ id: workspaceId })

	const filteredWorkspaces = workspaces?.filter((workspace) => workspace._id !== workspaceId)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					loading={loadingWorkspace}
					className='relative size-9 overflow-hidden bg-[#ababad] text-xl font-semibold text-slate-800 transition-colors duration-300 ease-in-out hover:bg-[#ababad]/80'
				>
					{workspace?.name.charAt(0).toUpperCase()}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent side='bottom' align='start' className='w-64'>
				<DropdownMenuItem
					onClick={() => router.push(`/workspace/${workspaceId}`)}
					className='cursor-pointer flex-col items-start justify-start gap-0 capitalize'
				>
					<p className='w-full truncate'>{workspace?.name}</p>

					<span className='text-xs text-muted-foreground normal-case'>Active workspace</span>
				</DropdownMenuItem>

				{filteredWorkspaces?.map((workspace) => (
					<DropdownMenuItem
						key={workspace._id}
						onClick={() => router.push(`/workspace/${workspace._id}`)}
						className='cursor-pointer capitalize'
					>
						<div className='relative mr-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-xl font-semibold text-white'>
							{workspace.name.charAt(0).toUpperCase()}
						</div>

						<p className='truncate'>{workspace.name}</p>
					</DropdownMenuItem>
				))}

				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={() => setOpen(true)} className='cursor-pointer'>
					<div className='relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#f2f2f2] text-xl font-semibold text-slate-800'>
						<PlusIcon />
					</div>
					Create a new workspace
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
