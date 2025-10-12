import { useAtom } from 'jotai'

import { Card } from '~/components/ui/card'

import { productAtom } from '../context'

export function Variants() {
	const [product] = useAtom(productAtom)

	if (!product) return null

	return <Card className="p-3">Variants</Card>
}
