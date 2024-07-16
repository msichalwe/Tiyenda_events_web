import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
	return (
		<Link href="/">
			<Image height={80} width={80} src="/assets/logo.png" alt="" />
		</Link>
	)
}

export default Logo
