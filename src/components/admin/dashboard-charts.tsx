'use client'

import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type WeeklyVisitsChartProps = {
	data: { day: string; visits: number }[]
}

export function WeeklyVisitsChart({ data }: WeeklyVisitsChartProps) {
	return (
		<div className='h-[280px]'>
			<ResponsiveContainer
				width='100%'
				height='100%'
			>
				<BarChart
					data={data}
					margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
				>
					<XAxis
						dataKey='day'
						tick={{ fontSize: 12 }}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						tick={{ fontSize: 12 }}
						tickLine={false}
						axisLine={false}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: 'hsl(var(--card))',
							border: '1px solid hsl(var(--border))',
							borderRadius: 'var(--radius)'
						}}
					/>
					<Bar
						dataKey='visits'
						fill='hsl(var(--chart-1))'
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}

type MembershipChartProps = {
	data: { type: string; count: number }[]
}

export function MembershipChart({ data }: MembershipChartProps) {
	return (
		<div className='h-[280px]'>
			<ResponsiveContainer
				width='100%'
				height='100%'
			>
				<AreaChart
					data={data}
					margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
				>
					<XAxis
						dataKey='type'
						tick={{ fontSize: 12 }}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						tick={{ fontSize: 12 }}
						tickLine={false}
						axisLine={false}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: 'hsl(var(--card))',
							border: '1px solid hsl(var(--border))',
							borderRadius: 'var(--radius)'
						}}
					/>
					<Area
						type='monotone'
						dataKey='count'
						stroke='hsl(var(--chart-2))'
						fill='hsl(var(--chart-2))'
						fillOpacity={0.3}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}
