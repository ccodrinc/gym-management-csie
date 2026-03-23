import { ImageResponse } from 'next/og'

import { BRAND_PRIMARY_HEX, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/site'

export const size = {
	width: 1200,
	height: 630
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
	return new ImageResponse(
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				background:
					'radial-gradient(circle at top left, rgba(88, 181, 116, 0.24), transparent 34%), radial-gradient(circle at bottom right, rgba(88, 181, 116, 0.16), transparent 30%), #111614',
				padding: '72px',
				color: 'white'
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 20
				}}
			>
				<div
					style={{
						height: 64,
						width: 64,
						borderRadius: 18,
						background: BRAND_PRIMARY_HEX,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 30,
						fontWeight: 800
					}}
				>
					R
				</div>
				<div
					style={{
						fontSize: 30,
						fontWeight: 700
					}}
				>
					{SITE_NAME}
				</div>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 18,
					maxWidth: 900
				}}
			>
				<div
					style={{
						fontSize: 70,
						fontWeight: 800,
						lineHeight: 1.05
					}}
				>
					{SITE_TAGLINE}
				</div>
				<div
					style={{
						fontSize: 28,
						lineHeight: 1.4,
						color: 'rgba(255,255,255,0.78)'
					}}
				>
					{SITE_DESCRIPTION}
				</div>
			</div>
		</div>,
		size
	)
}
