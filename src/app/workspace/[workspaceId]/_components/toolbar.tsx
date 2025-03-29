import { InfoIcon, SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'

export const Toolbar = () => {
	const workspaceId = useWorkspaceId()
	const { data } = useGetWorkspace({ id: workspaceId })

	return (
		<nav className="flex items-center justify-between h-10 p-1.5 bg-[#481349]">
			<div className="flex-1" />

			<div className="min-w-[280px] max-w-[642px] grow-2 shrink">
				<Button size="sm" className="justify-start w-full h-7 px-2 bg-accent/25 hover:bg-accent/25">
					<SearchIcon size={16} className="mr-2 text-white" />

					<span className="text-white text-xs">Search {data?.name}</span>
				</Button>
			</div>

			<div className="flex flex-1 items-center justify-end ml-auto">
				<Button variant="transparent" size="iconSm" className="transition-colors ease-in-out duration-300">
					<InfoIcon size={20} className="text-white" />
				</Button>
			</div>
		</nav>
	)
}
