import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { MemberSidebar } from '@/components/member/member-sidebar'

type PrivateLayoutProps = {
	children: React.ReactNode
	variant: 'admin' | 'member'
}

export function PrivateLayout({ children, variant }: PrivateLayoutProps) {
	const Sidebar = variant === 'admin' ? AdminSidebar : MemberSidebar

	return (
		<div className='flex h-screen overflow-hidden'>
			<Sidebar />
			<main className='bg-muted/30 flex-1 overflow-y-auto p-6'>{children}</main>
		</div>
	)
}
