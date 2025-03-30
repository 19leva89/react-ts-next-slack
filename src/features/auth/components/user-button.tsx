'use client'

import { LoaderIcon, LogOutIcon } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui'
import { useCurrentUser } from '../api/use-current-user'

export const UserButton = () => {
	const { signOut } = useAuthActions()
	const { data, isLoading } = useCurrentUser()

	if (isLoading) {
		return <LoaderIcon size={16} className="animate-spin text-muted-foreground" />
	}

	if (!data) {
		return null
	}

	const { name, image } = data

	const avatarFallback = name!.charAt(0).toUpperCase()

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="outline-hidden relative">
				<Avatar className="size-10 rounded-md cursor-pointer hover:opacity-75 transition ease-in-out duration-300">
					<AvatarImage alt={name} src={image} className="rounded-md" />

					<AvatarFallback className="rounded-md bg-sky-500 text-white">{avatarFallback}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="center" side="right" className="w-60">
				<DropdownMenuItem onClick={() => signOut()} className="h-10">
					<LogOutIcon size={16} className="mr-2" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
