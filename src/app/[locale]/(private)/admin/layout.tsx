import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex h-screen overflow-hidden'>
			<AdminSidebar />
			<main className='bg-muted/30 flex-1 overflow-y-auto p-6'>{children}</main>
		</div>
	)
}
