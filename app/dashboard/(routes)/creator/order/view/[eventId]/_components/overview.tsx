'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
}: any) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5
	const x = cx + radius * Math.cos(-midAngle * RADIAN)
	const y = cy + radius * Math.sin(-midAngle * RADIAN)

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? 'start' : 'end'}
			dominantBaseline="central">
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	)
}

const Overview = ({ data }: { data: any[] }) => {
	return (
		// <PieChart width={400} height={400}>

		<div style={{ width: '100%', height: 300 }}>
			<ResponsiveContainer>
				<PieChart>
					<Legend layout="horizontal" verticalAlign="top" align="center" />
					<Pie
						data={data}
						labelLine={false}
						label={renderCustomizedLabel}
						fill="#8884d8"
						dataKey="value">
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	)
}

export default Overview
