'use client'

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const chartTooltipStyle = {
	backgroundColor: 'hsl(var(--card))',
	border: '1px solid hsl(var(--border))',
	borderRadius: 'var(--radius)'
} as const

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
					margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
				>
					<CartesianGrid
						vertical={false}
						stroke='hsl(var(--border))'
						strokeOpacity={0.6}
					/>
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
					<Tooltip contentStyle={chartTooltipStyle} />
					<Bar
						dataKey='visits'
						fill='hsl(var(--chart-1))'
						radius={[8, 8, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}

type MemberActivityChartProps = {
	data: { day: string; count: number }[]
}

export function MemberActivityChart({ data }: MemberActivityChartProps) {
	return (
		<div className='h-[220px]'>
			<ResponsiveContainer
				width='100%'
				height='100%'
			>
				<BarChart
					data={data}
					margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
				>
					<CartesianGrid
						vertical={false}
						stroke='hsl(var(--border))'
						strokeOpacity={0.6}
					/>
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
					<Tooltip contentStyle={chartTooltipStyle} />
					<Bar
						dataKey='count'
						fill='hsl(var(--chart-1))'
						radius={[8, 8, 0, 0]}
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
					margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
				>
					<CartesianGrid
						vertical={false}
						stroke='hsl(var(--border))'
						strokeOpacity={0.6}
					/>
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
					<Tooltip contentStyle={chartTooltipStyle} />
					<Area
						type='monotone'
						dataKey='count'
						stroke='hsl(var(--chart-2))'
						fill='hsl(var(--chart-2))'
						fillOpacity={0.24}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}
