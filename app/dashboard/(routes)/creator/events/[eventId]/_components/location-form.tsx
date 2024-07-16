'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
	ComboboxOptionText,
} from '@reach/combobox'
import '@reach/combobox/styles.css'
import { Pencil } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import usePlacesAutocomplete, { 
	getGeocode,
	getLatLng,
} from 'use-places-autocomplete'
import {
	GoogleMap,
	useLoadScript,
	Marker,
	GoogleMapProps,
} from '@react-google-maps/api'
import { cn } from '@/lib/utils'

export const revalidate = 0

const formSchema = z.object({
	location: z
		.object({
			lat: z.number(),
			lng: z.number(),
		})
		.optional(),
	address: z.string().optional(),
	locationType: z.string().optional(),
})
type LatLngLiteral = google.maps.LatLngLiteral
type MapOptions = google.maps.MapOptions

interface LocationFormProps {
	initialData: {
		location: any
		address: string | null
		locationType: string | null
	}
	eventId: string
}

export default function LocationForm({
	initialData,
	eventId,
}: LocationFormProps) {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
		libraries: ['places'],
	})

	if (!isLoaded) return <div>Loading...</div>

	return <Map initialData={initialData} eventId={eventId} />
}

const Map: React.FC<LocationFormProps> = ({ eventId, initialData }) => {
	const [event, setEvent] = useState<LatLngLiteral>()
	const mapRef = useRef<GoogleMap>()
	const center = useMemo<LatLngLiteral>(() => {
		return { lat: -15.390963, lng: 28.317569 }
	}, [])

	const options = useMemo<MapOptions>(
		() => ({
			disableDefaultUI: true,
			clickableIcons: false,
		}),
		[],
	)

	const onLoad = useCallback((map: any) => (mapRef.current = map), [])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			location: initialData.location || { lat: -15.390963, lng: 28.317569 },
			address: initialData.address || '',
		},
	})

	const router = useRouter()

	const [selectLocationType, setSelectLocationType] = useState(
		initialData.locationType || 'venue',
	)
	const [isEditing, setIsEditing] = useState(false)

	const { isSubmitting, isValid } = form.formState

	const toggleEdit = () => setIsEditing((current) => !current)

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/events/${eventId}`, { ...values })
			toast.success('Event updated')
			router.refresh()
		} catch (error) {
			toast.error('Something went wrong')
		}
	}

	return (
		<>
			<div className="font-medium flex items-center justify-between">
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Location
						</>
					)}
				</Button>
			</div>
			{!isEditing && (
				<p
					className={cn(
						'text-sm mt-2',
						!initialData.location && 'text-slate-500 italic',
					)}>
					{initialData.address || 'No Location'}
				</p>
			)}
			{isEditing && (
				<>
					<div className="flex gap-x-6 my-5">
						<Button
							onClick={() => setSelectLocationType('venue')}
							variant={'outline'}
							className={`${
								selectLocationType === 'venue' &&
								'border-blue-500 text-blue-500'
							}`}>
							Venue
						</Button>
						<Button
							onClick={() => setSelectLocationType('tba')}
							variant={'outline'}
							className={`${
								selectLocationType === 'tba' && 'border-blue-500 text-blue-500'
							}`}>
							To be announced
						</Button>
					</div>
					{selectLocationType === 'venue' && (
						<>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<div className="places-container">
										<Places
											setAddress={(address: string) =>
												form.setValue('address', address)
											}
											setEvent={(position: LatLngLiteral) => {
												setEvent(position)
												mapRef.current?.panTo(position)
												form.setValue('location', position)
											}}
										/>
									</div>
									<div className="w-full h-[200px] mt-4 bg-red-500">
										<GoogleMap
											zoom={15}
											center={center}
											options={options}
											onLoad={onLoad}
											mapContainerClassName="w-full h-full">
											{event && (
												<Marker
													position={event}
													draggable={true}
													icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABuklEQVR4nO2WsUoDQRRFp9FK/IWwo6ImWOUXBGuFzKgYsIqFnZUSWyuTaLBJsLNR8AvUwsKsJDGd8R920SaJVi5cmVl0o3FjIsjMyhx47JT3vvtm5xFi+GdgeSIBbh2AWU0w+uyXPBeQmowTXUEqPgpGj8CpB04RUh6YVUQmOUK0E8/plRS5OgVkF4HyDnCW879fjTB6qZUJ+J0H1ueA413gvBhUafv7NJh1SPSZeerJzr+LP9kDthaAtemwUQK49Qoem1Wtn4hOSkHZpUB8Ot5H+KdRyqvWT8CtBylGzLowIDo/iHg/hXsdDHSkmNOcb6Dv2PQYaOtgoP2RQNiFDR0hq6XDHWgOJVq7EWK08GsDjO6r1k/EevDD6xv+G12JzRAdkOvB8N0vEF0Qa4FcDwYXf6HVKhGYEI+aeGH7jI24M7qJ77kTjOZfNufhpROyxBmc5rRYHQbFrrvoLhI1bGNAMSYB1ZgEVGMSUI1JQDUmAdWYBFRjElCNSUA1JgHVmARUY9edRpCC0yBR4/bO2egykCFR47rpjlXqTsuuOZ1q9WmcRJFKzS1Xam6JRJWb6mNSlGodBvKHvAEmVo/4wCwVdgAAAABJRU5ErkJggg=="
													onDragEnd={(e: any) => {
														const newPosition = {
															lat: e.latLng.lat(),
															lng: e.latLng.lng(),
														}
														setEvent(newPosition)
														form.setValue('location', newPosition)
													}}
												/>
											)}
										</GoogleMap>
									</div>
									<Button disabled={isSubmitting}>Save</Button>
								</form>
							</Form>
						</>
					)}
				</>
			)}
		</>
	)
}

type PlacesProps = {
	setEvent: (position: google.maps.LatLngLiteral) => void
	setAddress: (address: string) => void
}

const Places = ({ setEvent, setAddress }: PlacesProps) => {
	const {
		ready,
		value,
		setValue,
		suggestions: { status, data },
		clearSuggestions,
	} = usePlacesAutocomplete()

	const handleSelect = async (val: string) => {
		setValue(val, false)
		setAddress(val)
		clearSuggestions()

		const results = await getGeocode({ address: val })

		const { lat, lng } = await getLatLng(results[0])

		setEvent({ lat, lng })
	}

	return (
		<Combobox onSelect={handleSelect}>
			<ComboboxInput
				value={value}
				disabled={!ready}
				onChange={(e) => setValue(e.target.value)}
				className="w-full p-[0.5rem] border-gray-50 border rounded border-1"
				placeholder="Search Event Location"
			/>
			<ComboboxPopover>
				<ComboboxList>
					{status === 'OK' &&
						data.map(({ place_id, description }) => (
							<ComboboxOption key={place_id} value={description} />
						))}
				</ComboboxList>
			</ComboboxPopover>
		</Combobox>
	)
}
