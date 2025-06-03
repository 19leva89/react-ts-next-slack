'use client'

import { LoaderIcon } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal'

const HomePage = () => {
	const router = useRouter()

	const { data, isLoading } = useGetWorkspaces()
	const [open, setOpen] = useCreateWorkspaceModal()

	const workspaceId = useMemo(() => data?.[0]?._id, [data])

	useEffect(() => {
		if (isLoading) return

		if (workspaceId) {
			router.replace(`/workspace/${workspaceId}`)
		} else if (!open) {
			setOpen(true)
		}
	}, [workspaceId, isLoading, open, setOpen, router])

	return (
		<div className='flex h-full items-center justify-center'>
			<LoaderIcon size={24} className='animate-spin text-muted-foreground' />
		</div>
	)
}

export default HomePage
