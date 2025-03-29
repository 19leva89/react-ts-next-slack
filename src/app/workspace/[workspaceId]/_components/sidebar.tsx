import { usePathname } from 'next/navigation'
import { BellIcon, HomeIcon, MessagesSquareIcon, MoreHorizontalIcon } from 'lucide-react'

import { SidebarButton } from './sidebar-button'
import { WorkspaceSwitcher } from './workspace-switcher'
import { UserButton } from '@/features/auth/components/user-button'

export const Sidebar = () => {
	const pathname = usePathname()

	return (
		<aside className="flex flex-col items-center gap-y-4 w-[70px] h-full pt-[9px] pb-4 bg-[#481349]">
			<WorkspaceSwitcher />

			<SidebarButton icon={HomeIcon} label="Home" isActive={pathname.includes('/workspace')} />

			<SidebarButton icon={MessagesSquareIcon} label="DMs" />

			<SidebarButton icon={BellIcon} label="Activity" />

			<SidebarButton icon={MoreHorizontalIcon} label="More" />

			<div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
				<UserButton />
			</div>
		</aside>
	)
}
