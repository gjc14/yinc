import { useAtom } from 'jotai'

import { Card } from '~/components/ui/card'

import { productAtom } from '../context'

export function Details() {
	const [product] = useAtom(productAtom)

	if (!product) return null

	return <Card className="p-3">Details</Card>
}
