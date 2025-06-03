import { useState } from 'react'
import { ChevronDownIcon, ListFilterIcon, SquarePenIcon } from 'lucide-react'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui'
import { Hint } from '@/components/shared'
import { Doc } from '../../../../../convex/_generated/dataModel'
import { InviteModal, PreferencesModal } from '@/app/workspace/[workspaceId]/_components'

interface Props {
	workspace: Doc<'workspaces'>
	isOwner: boolean
}

export const WorkspaceHeader = ({ workspace, isOwner }: Props) => {
	const [inviteOpen, setInviteOpen] = useState<boolean>(false)
	const [preferencesOpen, setPreferencesOpen] = useState<boolean>(false)

	return (
		<>
			<InviteModal
				open={inviteOpen}
				setOpen={setInviteOpen}
				name={workspace.name}
				joinCode={workspace.joinCode}
			/>

			<PreferencesModal open={preferencesOpen} setOpen={setPreferencesOpen} initialValue={workspace.name} />

			<div className='flex h-[49px] items-center justify-between gap-0.5 px-4'>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='transparent'
							size='sm'
							className='w-auto overflow-hidden p-1.5 text-lg font-semibold transition-colors duration-300 ease-in-out'
						>
							<span className='truncate'>{workspace.name}</span>

							<ChevronDownIcon size={16} className='ml-1 shrink-0' />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent side='bottom' align='start' className='w-64'>
						<DropdownMenuItem className='cursor-pointer capitalize'>
							<div className='relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-xl font-semibold text-white'>
								{workspace.name.charAt(0).toUpperCase()}
							</div>

							<div className='flex flex-col items-start'>
								<p className='font-bold'>{workspace.name}</p>
								<p className='text-xs text-muted-foreground'>Active workspace</p>
							</div>
						</DropdownMenuItem>

						{isOwner && (
							<>
								<DropdownMenuSeparator />

								<DropdownMenuItem onClick={() => setInviteOpen(true)} className='cursor-pointer py-2'>
									Invite members to {workspace.name}
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem onClick={() => setPreferencesOpen(true)} className='cursor-pointer py-2'>
									Preferences
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>

				<div className='flex items-center gap-0.5'>
					<Hint label='Filter conversations'>
						<Button
							variant='transparent'
							size='iconSm'
							className='transition-colors duration-300 ease-in-out'
						>
							<ListFilterIcon size={16} />
						</Button>
					</Hint>

					<Hint label='New message'>
						<Button
							variant='transparent'
							size='iconSm'
							className='transition-colors duration-300 ease-in-out'
						>
							<SquarePenIcon size={16} />
						</Button>
					</Hint>
				</div>
			</div>
		</>
	)
}
