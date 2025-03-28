'use client'

import { PropsWithChildren } from 'react'

import { Toolbar } from './_components/toolbar'

const WorkspaceIdLayout = ({ children }: PropsWithChildren) => {
	return (
		<div className="h-full">
			<Toolbar />

			{children}
		</div>
	)
}

export default WorkspaceIdLayout
