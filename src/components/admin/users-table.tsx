'use client'

import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
		return users.filter((u) => (u.name?.toLowerCase().includes(q) ?? false) || u.username.toLowerCase().includes(q))
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
						<TableHead className='text-right'>{t('gymVisits')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filtered.map((user) => (
						<Dialog key={user.id}>
							<DialogTrigger asChild>
								<TableRow className='hover:bg-muted/50 cursor-pointer transition-colors'>
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
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										{user.name} - {t('history')}
									</DialogTitle>
								</DialogHeader>
								<div className='max-h-[60vh] space-y-4 overflow-y-auto'>
									{user.visitHistory && user.visitHistory.length > 0 ? (
										user.visitHistory.map((v, i) => (
											<div
												key={i}
												className='flex items-center justify-between border-b py-2 last:border-0'
											>
												<span className='text-muted-foreground'>{v.date}</span>
												<span className='font-medium'>{v.time}</span>
											</div>
										))
									) : (
										<div className='text-muted-foreground py-4 text-center'>{t('noHistory')}</div>
									)}
								</div>
							</DialogContent>
						</Dialog>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
