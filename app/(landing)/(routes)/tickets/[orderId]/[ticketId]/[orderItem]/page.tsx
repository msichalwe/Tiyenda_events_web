'use client'

import { fetcher } from '@/lib/fetcher'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import {
	Page,
	Text,
	Document,
	StyleSheet,
	Image,
	View,
	PDFViewer,
	Font,
} from '@react-pdf/renderer'
import { format } from 'date-fns'

Font.register({
	family: 'Helvetica',
	fonts: [
		{
			src: '/fonts/Helvetica.ttf',
		},
	],
})

Font.register({
	family: 'Helvetica-Bold',
	fonts: [
		{
			src: '/fonts/Helvetica-Bold.ttf',
			fontWeight: 700,
		},
	],
})

const styles = StyleSheet.create({
	page: {
		backgroundColor: 'white',
		display: 'flex',
		flexDirection: 'column',
		padding: 50,
		alignItems: 'center',
		width: '100%',
		fontFamily: 'Helvetica',
		height: '100%',
	},
	content: {
		padding: 20,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		border: '1px solid rgb(229 231 235)',
		borderRadius: 10,
		shadow: '0 0 10px rgba(0, 0, 0, 0.1)',
		width: '80%',
	},
	title: {
		fontSize: 24,
		textAlign: 'center',
		marginBottom: 10,
		fontWeight: 700,
		fontFamily: 'Helvetica-Bold',
		color: '#ED730D',
		textTransform: 'capitalize',
	},
	orientation: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',

		width: '100%',
		marginTop: 5,
		marginBottom: 5,
	},
	col: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		textAlign: 'left',
	},
	text: {
		fontSize: 14,
		margin: 5,
	},
	heaveText: {
		fontSize: 14,
		margin: 5,
		fontWeight: 700,
		fontFamily: 'Helvetica-Bold',
		textAlign: 'left',
	},
	separator: {
		borderBottom: '1px solid rgb(229 231 235)',
		width: '100%',
		marginTop: 10,
		marginBottom: 10,
	},
})

const PDFDocument = ({ data }: any) => {
	const formattedDate = format(new Date(data.order.createdAt), 'do, MMM yyyy')

	return (
		<Document>
			<Page>
				<View style={styles.page}>
					<View style={styles.content}>
						<Image
							src={'/assets/logo.png'}
							style={{
								width: 50,
								height: 50,
								marginBottom: 20,
							}}
						/>
						<Text style={styles.title}>{data.order.event.name}</Text>
						<View style={styles.separator} />

						<View style={styles.orientation}>
							<Text style={styles.heaveText}>Order:</Text>
							<View style={styles.col}>
								<Text style={styles.text}>
									Order: #{data.order.orderNumber}
								</Text>
								<Text style={styles.text}>Order Date: {formattedDate}</Text>
							</View>
						</View>
						<View style={styles.orientation}>
							<Text style={styles.heaveText}>Bill To:</Text>
							<View style={styles.col}>
								<Text style={styles.text}>{data.order.user.name}</Text>
								<Text style={styles.text}>{data.order.user.email}</Text>
							</View>
						</View>
						<View style={styles.orientation}>
							<View style={styles.col}>
								<Text style={styles.heaveText}>Price:</Text>
								<Text style={styles.text}>K{data.price}</Text>
							</View>
							<View style={styles.col}>
								<Text style={styles.heaveText}>Status:</Text>
								<Text style={styles.text}>{data.status}</Text>
							</View>
						</View>

						<Image
							src={data.qrcode}
							style={{
								width: 150,
								height: 150,
								marginTop: 20,
							}}
						/>
					</View>
				</View>
			</Page>
		</Document>
	)
}

const ViewTicket = () => {
	const params = useParams()

	const { data, isLoading } = useSWR(
		`/api/order-item/${params.orderItem}`,
		fetcher,
	)

	if (isLoading) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<Loader2 className="animate-spin" />
			</div>
		)
	}

	return (
		<div className="h-screen bg-[#515659] pt-20">
			<PDFViewer style={{ width: '100%', height: '100%' }}>
				{data && <PDFDocument data={data} />}
			</PDFViewer>
		</div>
	)
}

export default ViewTicket
