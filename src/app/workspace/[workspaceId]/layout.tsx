'use client'

import { PropsWithChildren } from 'react'

import { Toolbar } from './_components/toolbar'
import { Sidebar } from './_components/sidebar'

const WorkspaceIdLayout = ({ children }: PropsWithChildren) => {
	return (
		<div className="h-full">
			<Toolbar />

			<div className="flex h-[calc(100vh-40px)]">
				<Sidebar />

				{children}
			</div>
		</div>
	)
}

export default WorkspaceIdLayout
