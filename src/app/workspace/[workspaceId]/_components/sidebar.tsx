import { usePathname } from 'next/navigation'
import { BellIcon, HomeIcon, MessagesSquareIcon, MoreHorizontalIcon } from 'lucide-react'

import { UserButton } from '@/features/auth/components/user-button'
import { SidebarButton, WorkspaceSwitcher } from '@/app/workspace/[workspaceId]/_components'

export const Sidebar = () => {
	const pathname = usePathname()

	return (
		<aside className='flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] pt-[9px] pb-4'>
			<WorkspaceSwitcher />

			<SidebarButton icon={HomeIcon} label='Home' isActive={pathname.includes('/workspace')} />

			<SidebarButton icon={MessagesSquareIcon} label='DMs' />

			<SidebarButton icon={BellIcon} label='Activity' />

			<SidebarButton icon={MoreHorizontalIcon} label='More' />

			<div className='mt-auto flex flex-col items-center justify-center gap-y-1'>
				<UserButton />
			</div>
		</aside>
	)
}
