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

	const { mutate: removeMember, isPending: isRemovingMember } = useRemoveMember()
	const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember()
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
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between h-1/17 px-4 border-b">
					<p className="text-lg font-bold">Profile</p>

					<Button variant="ghost" size="iconSm" onClick={onClose}>
						<XIcon size={20} className="stroke-[1.5]" />
					</Button>
				</div>

				<div className="flex items-center justify-center h-full">
					<LoaderIcon size={20} className="text-muted-foreground animate-spin" />
				</div>
			</div>
		)
	}

	if (!member) {
		return (
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between h-1/17 px-4 border-b">
					<p className="text-lg font-bold">Profile</p>

					<Button variant="ghost" size="iconSm" onClick={onClose}>
						<XIcon size={20} className="stroke-[1.5]" />
					</Button>
				</div>

				<div className="flex flex-col items-center justify-center gap-y-2 h-full">
					<AlertTriangleIcon size={20} className="text-muted-foreground" />

					<p className="text-sm text-muted-foreground">Profile not found</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<div className="flex flex-col h-full">
				<div className="flex items-center justify-between h-1/18 px-4 border-b">
					<p className="text-lg font-bold">Profile</p>

					<Button variant="ghost" size="iconSm" onClick={onClose}>
						<XIcon size={20} className="stroke-[1.5]" />
					</Button>
				</div>

				<div className="flex items-center justify-center p-4">
					<Avatar className="size-full max-w-64 max-h-64 rounded-md mr-2">
						<AvatarImage src={member.user.image} alt={member.user.name} className="rounded-md" />

						<AvatarFallback className="aspect-square rounded-md bg-sky-500 text-white text-8xl">
							{avatarFallback}
						</AvatarFallback>
					</Avatar>
				</div>

				<div className="flex flex-col p-4">
					<p className="text-xl font-bold">{member.user.name}</p>

					{currentMember?.role === 'owner' && currentMember._id !== memberId && (
						<div className="flex items-center gap-2 mt-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="w-1/2 capitalize">
										{member.role} <ChevronDownIcon size={16} className="ml-2" />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent className="w-full">
									<DropdownMenuRadioGroup
										value={member.role}
										onValueChange={(role) => onUpdate(role as 'owner' | 'member')}
									>
										<DropdownMenuRadioItem value="owner">Owner</DropdownMenuRadioItem>

										<DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>

							<Button variant="outline" onClick={onRemove} className="w-1/2">
								Remove
							</Button>
						</div>
					)}

					{currentMember?._id === memberId && currentMember.role !== 'owner' && (
						<Button variant="outline" onClick={onLeave} className="w-full mt-4">
							Leave
						</Button>
					)}
				</div>

				<Separator />

				<div className="flex flex-col p-4">
					<p className="text-sm font-bold mb-4">Contact information</p>

					<div className="flex items-center gap-2">
						<div className="size-9 flex items-center justify-center rounded-md bg-muted">
							<MailIcon size={16} />
						</div>

						<div className="flex flex-col">
							<p className="text-sm font-semibold text-muted-foreground">Email address</p>

							<Link href={`mailto:${member.user.email}`} className="text-sm text-[#1264a3] hover:underline">
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
