import { redirect } from 'next/navigation'

import { PrivateLayout } from '@/app/[locale]/(private)/_components/private-layout'
import { getSession } from '@/auth'
import { Role } from '@/generated/prisma/client'

type Props = {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

export default async function TrainerLayout({ children, params }: Props) {
	const { locale } = await params
	const session = await getSession()

	if (!session?.user) {
		redirect(`/${locale}/login`)
	}

	if (session.user.role !== Role.TRAINER) {
		redirect(session.user.role === Role.ADMIN ? `/${locale}/admin` : `/${locale}/member`)
	}

	return <PrivateLayout variant='trainer'>{children}</PrivateLayout>
}
