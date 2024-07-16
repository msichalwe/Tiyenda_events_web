import { getApiDoc } from '@/lib/swagger'
import ReactSwagger from './react-swagger'

export default async function IndexPage() {
	const spec = await getApiDoc()
	return (
		<section className="container">
			<ReactSwagger spec={spec} />
		</section>
	)
}
