import Link from 'next/link'
import { useState } from 'react'
import { InfoIcon, SearchIcon } from 'lucide-react'

import {
	Button,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui'
import { useWorkspaceId } from '@/hooks'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'

export const Toolbar = () => {
	const workspaceId = useWorkspaceId()

	const [open, setOpen] = useState(false)

	const { data } = useGetWorkspace({ id: workspaceId })
	const { data: members } = useGetMembers({ workspaceId })
	const { data: channels } = useGetChannels({ workspaceId })

	return (
		<nav className='flex h-10 items-center justify-between bg-[#481349] p-1.5'>
			<div className='flex-1' />

			<div className='max-w-[642px] min-w-70 shrink grow-2'>
				<Button
					size='sm'
					onClick={() => setOpen(true)}
					className='h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25'
				>
					<SearchIcon size={16} className='mr-2 text-white' />

					<span className='text-xs text-white'>Search {data?.name}</span>
				</Button>

				<CommandDialog open={open} onOpenChange={setOpen}>
					<CommandInput placeholder='Type a command or search...' />

					<CommandList>
						<CommandEmpty>No results found</CommandEmpty>

						<CommandGroup heading='Channels'>
							{channels?.map((channel) => (
								<CommandItem
									key={channel._id}
									onSelect={() => setOpen(false)}
									className='cursor-pointer'
									asChild
								>
									<Link href={`/workspace/${workspaceId}/channel/${channel._id}`}>{channel.name}</Link>
								</CommandItem>
							))}
						</CommandGroup>

						<CommandSeparator />

						<CommandGroup heading='Members'>
							{members?.map((member) => (
								<CommandItem
									key={member._id}
									onSelect={() => setOpen(false)}
									className='cursor-pointer'
									asChild
								>
									<Link href={`/workspace/${workspaceId}/member/${member._id}`}>{member.user.name}</Link>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</CommandDialog>
			</div>

			<div className='ml-auto flex flex-1 items-center justify-end'>
				<Button variant='transparent' size='iconSm' className='transition-colors duration-300 ease-in-out'>
					<InfoIcon size={20} className='text-white' />
				</Button>
			</div>
		</nav>
	)
}
