import {
	Body,
	Container,
	Column,
	Head,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Text,
	render,
} from '@react-email/components'

import { format } from 'date-fns'

import { formatPrice } from '@/lib/utils'

import { OrderItem, Ticket } from '@prisma/client'

interface ReceiptEmailProps {
	email: string
	date: Date
	orderId: string
	orderNumber: string
	orderItems: (OrderItem & {
		ticket: Ticket
	})[]
}

export const ReceiptEmail = ({
	email,
	date,
	orderId,
	orderNumber,
	orderItems,
}: ReceiptEmailProps) => {
	const total = orderItems.reduce(
		(acc, curr) => acc + parseFloat(curr.price!),
		0,
	)

	return (
		<Html>
			<Head />
			<Preview>Your Tiyenda Receipt</Preview>

			<Body style={main}>
				<Container style={container}>
					<Section>
						<Column>
							<Img
								src={`https://res.cloudinary.com/dqrw0req3/image/upload/v1713779430/amejkjsb3ys9atsil7wt.png`}
								width="100"
								height="100"
								alt="Tiyenda"
							/>
						</Column>

						<Column align="right" style={tableCell}>
							<Text style={heading}>Receipt</Text>
						</Column>
					</Section>
					<Section style={informationTable}>
						<Row style={informationTableRow}>
							<Column style={informationTableColumn}>
								<Text style={informationTableLabel}>EMAIL</Text>
								<Link
									style={{
										...informationTableValue,
									}}>
									{email}
								</Link>
							</Column>

							<Column style={informationTableColumn}>
								<Text style={informationTableLabel}>INVOICE DATE</Text>
								<Text style={informationTableValue}>
									{format(date, 'dd MMM yyyy')}
								</Text>
							</Column>

							<Column style={informationTableColumn}>
								<Text style={informationTableLabel}>ORDER</Text>
								<Link
									style={{
										...informationTableValue,
									}}>
									#{orderNumber}
								</Link>
							</Column>
						</Row>
					</Section>
					<Section style={orderItemOrderItemTitleTable}>
						<Text style={orderItemsTitle}>Order Summary</Text>
					</Section>
					{orderItems.map((item) => {
						return (
							<Section key={item.id}>
								<Column style={{ width: '64px' }}></Column>
								<Column style={{ paddingLeft: '22px' }}>
									<Text style={orderItemOrderItemTitle}>
										{item.ticket.name}
									</Text>
									{item.ticket.description ? (
										<Text style={orderItemOrderItemDescription}>
											{item.ticket.description.length > 50
												? item.ticket.description?.slice(0, 50) + '...'
												: item.ticket.description}
										</Text>
									) : null}
									<Link
										href={`${process.env.NEXT_PUBLIC_BASE_URL}/tickets/${orderId}/${item.ticket.id}/${item.id}`}
										style={orderItemOrderItemLink}>
										Download Ticket
									</Link>
								</Column>

								<Column style={orderItemOrderItemPriceWrapper} align="right">
									<Text style={orderItemOrderItemPrice}>
										{formatPrice(parseFloat(item.price!))}
									</Text>
								</Column>
							</Section>
						)
					})}

					<Section>
						<Column style={{ width: '64px' }}></Column>
					</Section>

					<Hr style={orderItemOrderItemPriceLine} />
					<Section align="right">
						<Column style={tableCell} align="right">
							<Text style={orderItemOrderItemPriceTotal}>TOTAL</Text>
						</Column>
						<Column style={orderItemOrderItemPriceVerticalLine}></Column>
						<Column style={orderItemOrderItemPriceLargeWrapper}>
							<Text style={orderItemOrderItemPriceLarge}>
								{formatPrice(total)}
							</Text>
						</Column>
					</Section>
					<Hr style={orderItemOrderItemPriceLineBottom} />

					<Text style={footerLinksWrapper}>
						<Link href="#">Account Settings</Link> •{' '}
						<Link href="#">Terms of Sale</Link> •{' '}
						<Link href="#">Privacy Policy </Link>
					</Text>
					<Text style={footerCopyright}>
						Copyright © 2024 Tiyenda Inc. <br />{' '}
						<Link href="#">All rights reserved</Link>
					</Text>
				</Container>
			</Body>
		</Html>
	)
}

export const ReceiptEmailHtml = (props: ReceiptEmailProps) =>
	render(<ReceiptEmail {...props} />, {
		pretty: true,
	})

const main = {
	fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
	backgroundColor: '#ffffff',
}

const resetText = {
	margin: '0',
	padding: '0',
	lineHeight: 1.4,
}

const container = {
	margin: '0 auto',
	padding: '20px 0 48px',
	width: '660px',
}

const tableCell = { display: 'table-cell' }

const heading = {
	fontSize: '28px',
	fontWeight: '300',
	color: '#888888',
}

const informationTable = {
	borderCollapse: 'collapse' as const,
	borderSpacing: '0px',
	color: 'rgb(51,51,51)',
	backgroundColor: 'rgb(250,250,250)',
	borderRadius: '3px',
	fontSize: '12px',
	marginTop: '12px',
}

const informationTableRow = {
	height: '46px',
}

const informationTableColumn = {
	paddingLeft: '20px',
	borderStyle: 'solid',
	borderColor: 'white',
	borderWidth: '0px 1px 1px 0px',
	height: '44px',
}

const informationTableLabel = {
	...resetText,
	color: 'rgb(102,102,102)',
	fontSize: '10px',
}

const informationTableValue = {
	fontSize: '12px',
	margin: '0',
	padding: '0',
	lineHeight: 1.4,
}

const orderItemOrderItemTitleTable = {
	...informationTable,
	margin: '30px 0 15px 0',
	height: '24px',
}

const orderItemsTitle = {
	background: '#fafafa',
	paddingLeft: '10px',
	fontSize: '14px',
	fontWeight: '500',
	margin: '0',
}

const orderItemOrderItemIcon = {
	margin: '0 0 0 20px',
	borderRadius: '14px',
	border: '1px solid rgba(128,128,128,0.2)',
}

const orderItemOrderItemTitle = {
	fontSize: '12px',
	fontWeight: '600',
	...resetText,
}

const orderItemOrderItemDescription = {
	fontSize: '12px',
	color: 'rgb(102,102,102)',
	...resetText,
}

const orderItemOrderItemLink = {
	fontSize: '12px',
	color: 'rgb(0,112,201)',
	textDecoration: 'none',
}

const orderItemOrderItemPriceTotal = {
	margin: '0',
	color: 'rgb(102,102,102)',
	fontSize: '10px',
	fontWeight: '600',
	padding: '0px 30px 0px 0px',
	textAlign: 'right' as const,
}

const orderItemOrderItemPrice = {
	fontSize: '12px',
	fontWeight: '600',
	margin: '0',
}

const orderItemOrderItemPriceLarge = {
	margin: '0px 20px 0px 0px',
	fontSize: '16px',
	fontWeight: '600',
	whiteSpace: 'nowrap' as const,
	textAlign: 'right' as const,
}

const orderItemOrderItemPriceWrapper = {
	display: 'table-cell',
	padding: '0px 20px 0px 0px',
	width: '100px',
	verticalAlign: 'top',
}

const orderItemOrderItemPriceLine = { margin: '30px 0 0 0' }

const orderItemOrderItemPriceVerticalLine = {
	height: '48px',
	borderLeft: '1px solid',
	borderColor: 'rgb(238,238,238)',
}

const orderItemOrderItemPriceLargeWrapper = {
	display: 'table-cell',
	width: '90px',
}

const orderItemOrderItemPriceLineBottom = { margin: '0 0 75px 0' }

const footerLinksWrapper = {
	margin: '8px 0 0 0',
	textAlign: 'center' as const,
	fontSize: '12px',
	color: 'rgb(102,102,102)',
}

const footerCopyright = {
	margin: '25px 0 0 0',
	textAlign: 'center' as const,
	fontSize: '12px',
	color: 'rgb(102,102,102)',
}
