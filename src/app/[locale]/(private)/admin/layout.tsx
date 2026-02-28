import { PrivateLayout } from '@/components/layouts/private-layout'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return <PrivateLayout variant='admin'>{children}</PrivateLayout>
}
