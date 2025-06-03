import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { AlertTriangleIcon, ChevronDownIcon, LoaderIcon, MailIcon, XIcon } from 'lucide-react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
	Separator,
} from '@/components/ui'
import { useConfirm, useWorkspaceId } from '@/hooks'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGetMember } from '@/features/members/api/use-get-member'
import { useRemoveMember } from '@/features/members/api/use-remove-member'
import { useUpdateMember } from '@/features/members/api/use-update-member'
import { useCurrentMember } from '@/features/members/api/use-current-member'

interface Props {
	memberId: Id<'members'>
	onClose: () => void
}

export const Profile = ({ memberId, onClose }: Props) => {
	const router = useRouter()
	const workspaceId = useWorkspaceId()

	const [UpdateDialog, confirmUpdate] = useConfirm(
		'Change role',
		"Are you sure you want to change this member's role?",
	)

	const [LeaveDialog, confirmLeave] = useConfirm(
		'Leave workspace',
		'Are you sure you want to leave this workspace?',
	)

	const [RemoveDialog, confirmRemove] = useConfirm(
		'Remove member',
		'Are you sure you want to remove this member?',
	)

	const { mutate: removeMember } = useRemoveMember()
	const { mutate: updateMember } = useUpdateMember()
	const { data: member, isLoading: loadingMember } = useGetMember({ id: memberId })
	const { data: currentMember, isLoading: loadingCurrentMember } = useCurrentMember({ workspaceId })

	const avatarFallback = member?.user?.name?.charAt(0).toUpperCase() || 'M'

	const onRemove = async () => {
		const ok = await confirmRemove()

		if (!ok) return

		removeMember(
			{ id: memberId },
			{
				onSuccess: () => {
					toast.success('Member removed')
					onClose()
				},
				onError: () => {
					toast.error('Failed to remove member')
				},
			},
		)
	}

	const onLeave = async () => {
		const ok = await confirmLeave()

		if (!ok) return

		removeMember(
			{ id: memberId },
			{
				onSuccess: () => {
					router.replace('/')
					toast.success('You left the workspace')
					onClose()
				},
				onError: () => {
					toast.error('Failed to leave the workspace')
				},
			},
		)
	}

	const onUpdate = async (role: 'owner' | 'member') => {
		const ok = await confirmUpdate()

		if (!ok) return

		updateMember(
			{ id: memberId, role },
			{
				onSuccess: () => {
					toast.success('Role changed')
					onClose()
				},
				onError: () => {
					toast.error('Failed to change role')
				},
			},
		)
	}

	if (loadingMember || loadingCurrentMember) {
		return (
			<div className='flex h-full flex-col'>
				<div className='flex h-1/17 items-center justify-between px-4'>
					<p className='text-lg font-bold'>Profile</p>

					<Button variant='ghost' size='iconSm' onClick={onClose}>
						<XIcon size={20} className='stroke-[1.5]' />
					</Button>
				</div>

				<Separator />

				<div className='flex h-full items-center justify-center'>
					<LoaderIcon size={20} className='animate-spin text-muted-foreground' />
				</div>
			</div>
		)
	}

	if (!member) {
		return (
			<div className='flex h-full flex-col'>
				<div className='flex h-1/17 items-center justify-between px-4'>
					<p className='text-lg font-bold'>Profile</p>

					<Button variant='ghost' size='iconSm' onClick={onClose}>
						<XIcon size={20} className='stroke-[1.5]' />
					</Button>
				</div>

				<Separator />

				<div className='flex h-full flex-col items-center justify-center gap-y-2'>
					<AlertTriangleIcon size={20} className='text-muted-foreground' />

					<p className='text-sm text-muted-foreground'>Profile not found</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<div className='flex h-full flex-col'>
				<div className='flex h-1/18 items-center justify-between px-4'>
					<p className='text-lg font-bold'>Profile</p>

					<Button variant='ghost' size='iconSm' onClick={onClose}>
						<XIcon size={20} className='stroke-[1.5]' />
					</Button>
				</div>

				<Separator />

				<div className='flex items-center justify-center p-4'>
					<Avatar className='mr-2 size-full max-h-64 max-w-64 rounded-md'>
						<AvatarImage src={member.user.image} alt={member.user.name} className='rounded-md' />

						<AvatarFallback className='aspect-square rounded-md bg-sky-500 text-8xl text-white'>
							{avatarFallback}
						</AvatarFallback>
					</Avatar>
				</div>

				<div className='flex flex-col p-4'>
					<p className='text-xl font-bold'>{member.user.name}</p>

					{currentMember?.role === 'owner' && currentMember._id !== memberId && (
						<div className='mt-4 flex items-center gap-2'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='outline' className='w-1/2 capitalize'>
										{member.role} <ChevronDownIcon size={16} className='ml-2' />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent className='w-full'>
									<DropdownMenuRadioGroup
										value={member.role}
										onValueChange={(role) => onUpdate(role as 'owner' | 'member')}
									>
										<DropdownMenuRadioItem value='owner'>Owner</DropdownMenuRadioItem>

										<DropdownMenuRadioItem value='member'>Member</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>

							<Button variant='outline' onClick={onRemove} className='w-1/2'>
								Remove
							</Button>
						</div>
					)}

					{currentMember?._id === memberId && currentMember.role !== 'owner' && (
						<Button variant='outline' onClick={onLeave} className='mt-4 w-full'>
							Leave
						</Button>
					)}
				</div>

				<Separator />

				<div className='flex flex-col p-4'>
					<p className='mb-4 text-sm font-bold'>Contact information</p>

					<div className='flex items-center gap-2'>
						<div className='flex size-9 items-center justify-center rounded-md bg-muted'>
							<MailIcon size={16} />
						</div>

						<div className='flex flex-col'>
							<p className='text-sm font-semibold text-muted-foreground'>Email address</p>

							<Link href={`mailto:${member.user.email}`} className='text-sm text-[#1264a3] hover:underline'>
								{member.user.email}
							</Link>
						</div>
					</div>
				</div>
			</div>

			<UpdateDialog />
			<LeaveDialog />
			<RemoveDialog />
		</>
	)
}
