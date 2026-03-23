import type { Metadata } from 'next'

type Props = {
	children: React.ReactNode
}

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: false
	}
}

export default function PrivateRouteLayout({ children }: Props) {
	return children
}
