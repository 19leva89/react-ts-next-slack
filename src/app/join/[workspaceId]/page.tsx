'use client'

import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ConvexError } from 'convex/values'
import { ArrowLeftIcon, LoaderIcon } from 'lucide-react'

import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useJoin } from '@/features/workspaces/api/use-join'
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info'
import { Button, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui'

const JoinPage = () => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()

	const { mutate, isPending } = useJoin()
	const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId })

	const isMember = useMemo(() => data?.isMember, [data?.isMember])

	useEffect(() => {
		if (isMember) {
			router.push(`/workspace/${workspaceId}`)
		}
	}, [isMember, workspaceId, router])

	const handleComplete = (value: string) =>
		mutate(
			{ workspaceId, joinCode: value },
			{
				onSuccess: (id) => {
					router.replace(`/workspace/${id}`)
					toast.success('Workspace joined')
				},
				onError: (error) => {
					const message = error instanceof ConvexError ? error.data : 'Unknown error'
					toast.error(message)
				},
			},
		)

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<LoaderIcon size={24} className="animate-spin text-muted-foreground" />
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center gap-y-8 h-full p-8 rounded-lg bg-white shadow-md">
			<Image src="/svg/logo.svg" width={60} height={60} alt="Logo" />

			<div className="flex flex-col items-center justify-center gap-y-4 max-w-md">
				<div className="flex flex-col items-center justify-center gap-y-2">
					<h1 className="text-2xl font-bold">Join {data?.name}</h1>

					<p className="text-md text-muted-foreground">Enter the workspace code to join</p>
				</div>

				<InputOTP maxLength={6} autoFocus onComplete={handleComplete} disabled={isPending}>
					<InputOTPGroup className="uppercase">
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
					</InputOTPGroup>

					<InputOTPSeparator />

					<InputOTPGroup className="uppercase">
						<InputOTPSlot index={3} />
						<InputOTPSlot index={4} />
						<InputOTPSlot index={5} />
					</InputOTPGroup>
				</InputOTP>
			</div>

			<div className="flex gap-x-4">
				<Button variant="outline" size="lg" asChild>
					<Link href="/">
						<ArrowLeftIcon />
						Back to home
					</Link>
				</Button>
			</div>
		</div>
	)
}

export default JoinPage
