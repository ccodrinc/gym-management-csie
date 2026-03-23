import { redirect } from 'next/navigation'

import { PrivateLayout } from '@/app/[locale]/(private)/_components/private-layout'
import { getSession } from '@/auth'
import { Role } from '@/generated/prisma/client'

type Props = {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

export default async function AdminLayout({ children, params }: Props) {
	const { locale } = await params
	const session = await getSession()

	if (!session?.user) {
		redirect(`/${locale}/login`)
	}

	if (session.user.role !== Role.ADMIN) {
		redirect(`/${locale}/member`)
	}

	return <PrivateLayout variant='admin'>{children}</PrivateLayout>
}
