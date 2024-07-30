import Navbar from '../components/Navbar'
import Footer from '../components/footer'
import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import PageTransition from "@/app/(landing)/transition";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {

	return (
		<div>
			<Navbar />

			{children}


			<Footer />
		</div>
	)
}

export default LandingLayout
