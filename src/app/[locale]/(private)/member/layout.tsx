import { PrivateLayout } from '@/components/layouts/private-layout'

export default function MemberLayout({ children }: { children: React.ReactNode }) {
	return <PrivateLayout variant='member'>{children}</PrivateLayout>
}
