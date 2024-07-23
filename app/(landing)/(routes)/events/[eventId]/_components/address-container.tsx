'use client'

type AddressContainerProps = {
	location: any
	address: string
}

const AddressContainer: React.FC<AddressContainerProps> = ({
	location,
	address,
}) => {
	const handleAddressClick = () => {
		// Use the latitude and longitude from the event's location
		const { lat, lng } = location

		// Construct the Google Maps URL
		const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

		// Open the Maps URL in a new tab
		window.open(mapsUrl, '_blank')
	}
	return (
		<a
			href="#"
			onClick={handleAddressClick}
			className="text-sm font-medium hover:cursor-pointer hover:text-blue-500 hover:underline">
			{address}
		</a>
	)
}

export default AddressContainer
