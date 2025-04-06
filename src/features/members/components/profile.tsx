import Link from 'next/link'
import { AlertTriangleIcon, LoaderIcon, MailIcon, XIcon } from 'lucide-react'

import { Id } from '../../../../convex/_generated/dataModel'
import { useGetMember } from '@/features/members/api/use-get-member'
import { Avatar, AvatarFallback, AvatarImage, Button, Separator } from '@/components/ui'

interface Props {
	memberId: Id<'members'>
	onClose: () => void
}

export const Profile = ({ memberId, onClose }: Props) => {
	const { data: member, isLoading: loadingMember } = useGetMember({ id: memberId })

	const avatarFallback = member?.user?.name?.charAt(0).toUpperCase() || 'M'

	if (loadingMember) {
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
	)
}
