'use client'

import { useTranslations } from 'next-intl'
import { useDeferredValue, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Member } from '@/lib/data'

type UsersTableProps = {
	users: Member[]
}

export function UsersTable({ users }: UsersTableProps) {
	const t = useTranslations('Admin.users')
	const [query, setQuery] = useState('')
	const [selectedUser, setSelectedUser] = useState<Member | null>(null)
	const deferredQuery = useDeferredValue(query)
	const normalizedQuery = deferredQuery.toLowerCase().trim()
	const filtered = !normalizedQuery
		? users
		: users.filter(
				(user) =>
					(user.name?.toLowerCase().includes(normalizedQuery) ?? false) ||
					user.username.toLowerCase().includes(normalizedQuery)
			)

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
						<TableRow
							key={user.id}
							className='hover:bg-muted/50 cursor-pointer transition-colors'
							onClick={() => setSelectedUser(user)}
						>
							<TableCell className='font-medium'>{user.name ?? user.username}</TableCell>
							<TableCell className='text-muted-foreground'>{user.username}</TableCell>
							<TableCell>{user.membershipType}</TableCell>
							<TableCell>
								<Badge variant={user.isActive ? 'default' : 'secondary'}>
									{user.membershipStatus}
								</Badge>
							</TableCell>
							<TableCell>{user.startDate ?? '—'}</TableCell>
							<TableCell>{user.expiryDate ?? '—'}</TableCell>
							<TableCell className='text-right font-medium'>{user.gymVisits}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Dialog
				open={Boolean(selectedUser)}
				onOpenChange={(open) => {
					if (!open) setSelectedUser(null)
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{selectedUser?.name ?? selectedUser?.username} - {t('history')}
						</DialogTitle>
					</DialogHeader>
					<div className='max-h-[60vh] space-y-4 overflow-y-auto'>
						{selectedUser?.visitHistory && selectedUser.visitHistory.length > 0 ? (
							selectedUser.visitHistory.map((visit, index) => (
								<div
									key={`${visit.date}-${visit.time}-${index}`}
									className='flex items-center justify-between border-b py-2 last:border-0'
								>
									<span className='text-muted-foreground'>{visit.date}</span>
									<span className='font-medium'>{visit.time}</span>
								</div>
							))
						) : (
							<div className='text-muted-foreground py-4 text-center'>{t('noHistory')}</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
