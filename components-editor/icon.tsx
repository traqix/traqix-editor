'use client'

import { memo } from 'react'
import dynamic from 'next/dynamic'

const Icon = memo(({ name, ...props }) => {

	const LucideIcon = dynamic(() =>
		import('lucide-react').then((mod) => {
			return mod[name] || mod['Ban']
		})
	)

	return <LucideIcon {...props} />
})

Icon.displayName = 'Icon'

export default Icon