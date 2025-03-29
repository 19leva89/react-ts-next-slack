'use client'

import { PropsWithChildren } from 'react'

import { Toolbar } from './_components/toolbar'
import { Sidebar } from './_components/sidebar'
import { WorkspaceSidebar } from './_components/workspace-sidebar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'

const WorkspaceIdLayout = ({ children }: PropsWithChildren) => {
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
				</ResizablePanelGroup>
			</div>
		</div>
	)
}

export default WorkspaceIdLayout
