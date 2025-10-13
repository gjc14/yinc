import { useAtom } from 'jotai'

import { Card } from '~/components/ui/card'

import { productAtom } from '../../../../store/product/context'

export function LinkedProducts() {
	const [product] = useAtom(productAtom)

	if (!product) return null

	return <Card className="p-3">LinkedProducts</Card>
}
