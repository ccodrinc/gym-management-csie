import { setRequestLocale } from 'next-intl/server'

import { getMembers } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FadeIn } from '@/components/motion'

type Props = {
	params: Promise<{ locale: string }>
}

export default async function AdminUsersPage({ params }: Props) {
	const { locale } = await params
	setRequestLocale(locale)
	const users = await getMembers()

	return (
		<FadeIn className='space-y-6'>
			<div>
				<h1 className='text-foreground text-2xl font-semibold tracking-tight'>Users</h1>
				<p className='text-muted-foreground text-sm'>Manage members, view membership status and gym activity</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Members</CardTitle>
					<CardDescription>
						{users.filter((u) => u.isActive).length} active · {users.length} total
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Membership</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Start</TableHead>
								<TableHead>Expiry</TableHead>
								<TableHead className='text-right'>Gym Visits</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell className='font-medium'>{user.name}</TableCell>
									<TableCell className='text-muted-foreground'>{user.email}</TableCell>
									<TableCell>{user.membershipType}</TableCell>
									<TableCell>
										<Badge variant={user.isActive ? 'default' : 'secondary'}>
											{user.isActive ? 'Active' : 'Expired'}
										</Badge>
									</TableCell>
									<TableCell>{user.startDate}</TableCell>
									<TableCell>{user.expiryDate}</TableCell>
									<TableCell className='text-right font-medium'>{user.gymVisits}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</FadeIn>
	)
}
