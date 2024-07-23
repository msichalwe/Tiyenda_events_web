'use client'
import { getAllEvents } from '@/actions'
import { getDistance } from 'geolib'
import { GeolibInputCoordinates } from 'geolib/es/types'
import { useCallback, useEffect, useState } from 'react'

const NearByEvents = () => {
	const [nearByEvents, setNearByEvents] = useState()
	const [range, setRange] = useState(20)
	const [clientLocation, setClientLocation] = useState<GeolibInputCoordinates>({
		latitude: '',
		longitude: '',
	})

	// const nearByFnc = useCallback(() => {
	// 	navigator.geolocation.getCurrentPosition((position) => {
	// 		setClientLocation({
	// 			latitude: position.coords.latitude,
	// 			longitude: position.coords.longitude,
	// 		})
	// 	})

	// 	const fetchEvents = async () => {
	// 		const allEvents = await getAllEvents({
	// 			query: '',
	// 			limit: 6,
	// 			page: 1,
	// 			categoryId: '',
	// 		})

	// 		if (!allEvents) {
	// 			return
	// 		}

	// 		const filteredEvents = allEvents.data.filter((event) => {
	// 			const distanceInKm = getDistance(clientLocation, {
	// 				latitude: event?.location!.lat,
	// 				longitude: event?.location!.lng,
	// 			})

	// 			return distanceInKm <= range
	// 		})
	// 		// setNearByEvents(filteredEvents)
	// 	}
	// }, [])

	useEffect(() => {}, [clientLocation])

	return <div>Near By events</div>
}

export default NearByEvents
