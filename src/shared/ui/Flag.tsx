import React, { useState } from 'react'

interface FlagProps {
	src: string
	alt: string
	width?: number
}

export const Flag: React.FC<FlagProps> = ({ src, alt, width }) => {
	const [hasError, setHasError] = useState(false)

	if (hasError || !src) {
		return <span>Err</span>
	}

	return (
		<img src={src} alt={alt} width={width} onError={() => setHasError(true)} />
	)
}
