'use client'

import { useDeferredValue, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Member } from '@/lib/data'
import { formatDate, formatNumber } from '@/lib/format'

type UsersTableProps = {
	users: Member[]
}

export function UsersTable({ users }: UsersTableProps) {
	const locale = useLocale()
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
		<div className='flex flex-col gap-4'>
			<div className='flex flex-wrap items-center gap-3'>
				<label
					htmlFor='member-search'
					className='sr-only'
				>
					{t('searchLabel')}
				</label>
				<Input
					id='member-search'
					name='memberSearch'
					type='search'
					placeholder={t('searchPlaceholder')}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					className='max-w-sm'
					autoComplete='off'
				/>
				<p className='text-muted-foreground text-sm'>
					{t('resultsCount', { count: filtered.length, total: users.length })}
				</p>
			</div>

			<Table>
				<TableCaption>{t('historyCaption')}</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>{t('name')}</TableHead>
						<TableHead>{t('username')}</TableHead>
						<TableHead>{t('membership')}</TableHead>
						<TableHead>{t('status')}</TableHead>
						<TableHead>{t('start')}</TableHead>
						<TableHead>{t('expiry')}</TableHead>
						<TableHead className='text-right'>{t('gymVisits')}</TableHead>
						<TableHead className='text-right'>{t('history')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filtered.length ? (
						filtered.map((user) => (
							<TableRow key={user.id}>
								<TableCell className='font-medium'>{user.name ?? user.username}</TableCell>
								<TableCell className='text-muted-foreground'>{user.username}</TableCell>
								<TableCell>{user.membershipType}</TableCell>
								<TableCell>
									<Badge variant={user.isActive ? 'default' : 'secondary'}>{user.membershipStatus}</Badge>
								</TableCell>
								<TableCell>{formatDate(user.startDate, locale)}</TableCell>
								<TableCell>{formatDate(user.expiryDate, locale)}</TableCell>
								<TableCell className='text-right font-medium'>{formatNumber(user.gymVisits, locale)}</TableCell>
								<TableCell className='text-right'>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => setSelectedUser(user)}
									>
										{t('viewHistory')}
									</Button>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={8}
								className='text-muted-foreground py-8 text-center'
							>
								{t('emptySearch')}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<Dialog
				open={Boolean(selectedUser)}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedUser(null)
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{selectedUser?.name ?? selectedUser?.username} · {t('history')}
						</DialogTitle>
						<DialogDescription>{t('historyDescription')}</DialogDescription>
					</DialogHeader>

					<div className='max-h-[60vh] overflow-y-auto'>
						{selectedUser?.visitHistory?.length ? (
							<ul className='flex flex-col divide-y'>
								{selectedUser.visitHistory.map((visit, index) => (
									<li
										key={`${visit.date}-${visit.time}-${index}`}
										className='flex items-center justify-between gap-4 py-3'
									>
										<span className='text-muted-foreground'>{formatDate(visit.date, locale)}</span>
										<span className='font-medium'>{visit.time}</span>
									</li>
								))}
							</ul>
						) : (
							<div className='text-muted-foreground py-4 text-center'>{t('noHistory')}</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
