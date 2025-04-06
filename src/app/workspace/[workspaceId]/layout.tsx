'use client'

import { LoaderIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'

import { usePanel } from '@/hooks'
import { Id } from '../../../../convex/_generated/dataModel'
import { Thread } from '@/features/messages/components/thread'
import { Profile } from '@/features/members/components/profile'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'
import { Sidebar, Toolbar, WorkspaceSidebar } from '@/app/workspace/[workspaceId]/_components'

const WorkspaceIdLayout = ({ children }: PropsWithChildren) => {
	const { parentMessageId, profileMemberId, onClose } = usePanel()

	const showPanel = !!parentMessageId || !!profileMemberId

	return (
		<div className="h-full">
			<Toolbar />

			<div className="flex h-[calc(100vh-40px)]">
				<Sidebar />

				<ResizablePanelGroup direction="horizontal" autoSaveId={'ds-workspace-layout'}>
					<ResizablePanel minSize={11} defaultSize={20} className="bg-[#5e2c5f]">
						<WorkspaceSidebar />
					</ResizablePanel>

					<ResizableHandle withHandle />

					<ResizablePanel minSize={20}>{children}</ResizablePanel>

					{showPanel && (
						<>
							<ResizableHandle withHandle />

							<ResizablePanel minSize={20} defaultSize={29}>
								{parentMessageId ? (
									<Thread messageId={parentMessageId as Id<'messages'>} onClose={onClose} />
								) : profileMemberId ? (
									<Profile memberId={profileMemberId as Id<'members'>} onClose={onClose} />
								) : (
									<div className="flex items-center justify-center h-full">
										<LoaderIcon size={20} className="text-muted-foreground animate-spin" />
									</div>
								)}
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>
			</div>
		</div>
	)
}

export default WorkspaceIdLayout
