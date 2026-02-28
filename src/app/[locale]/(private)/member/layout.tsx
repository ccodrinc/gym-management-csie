import { MemberSidebar } from '@/components/member/member-sidebar'

export default function MemberLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex h-screen overflow-hidden'>
			<MemberSidebar />
			<main className='bg-muted/30 flex-1 overflow-y-auto p-6'>{children}</main>
		</div>
	)
}
