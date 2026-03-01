'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import type { Member } from '@/lib/data'

type UsersTableProps = {
	users: Member[]
}

export function UsersTable({ users }: UsersTableProps) {
	const t = useTranslations('Admin.users')
	const [query, setQuery] = useState('')

	const filtered = useMemo(() => {
		if (!query.trim()) return users
		const q = query.toLowerCase().trim()
		return users.filter(
			(u) =>
				(u.name?.toLowerCase().includes(q) ?? false) || u.username.toLowerCase().includes(q)
		)
	}, [users, query])

	return (
		<div className='space-y-4'>
			<Input
				type='search'
				placeholder={t('searchPlaceholder')}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className='max-w-sm'
				aria-label={t('searchPlaceholder')}
			/>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t('name')}</TableHead>
						<TableHead>{t('username')}</TableHead>
						<TableHead>{t('membership')}</TableHead>
						<TableHead>{t('status')}</TableHead>
						<TableHead>{t('start')}</TableHead>
						<TableHead>{t('expiry')}</TableHead>
						<TableHead className='text-right'>{t('gymVisits')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filtered.map((user) => (
						<TableRow key={user.id}>
							<TableCell className='font-medium'>{user.name}</TableCell>
							<TableCell className='text-muted-foreground'>{user.username}</TableCell>
							<TableCell>{user.membershipType}</TableCell>
							<TableCell>
								<Badge variant={user.isActive ? 'default' : 'secondary'}>
									{user.isActive ? t('active') : t('expired')}
								</Badge>
							</TableCell>
							<TableCell>{user.startDate}</TableCell>
							<TableCell>{user.expiryDate}</TableCell>
							<TableCell className='text-right font-medium'>{user.gymVisits}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
