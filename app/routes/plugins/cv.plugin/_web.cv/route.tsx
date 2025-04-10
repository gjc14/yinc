import {
	useLoaderData,
	type LoaderFunctionArgs,
	type MetaFunction,
} from 'react-router'

import { UnderConstruction } from '~/components/under-construction'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'
import { Footer } from '~/routes/web/components/footer'
import { Nav } from '~/routes/web/components/nav'

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
	if (!data || !data.meta) {
		return []
	}

	return data.meta.metaTags
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { seo } = await getSEO(new URL(request.url).pathname)
	const meta = seo ? createMeta(seo, new URL(request.url)) : null

	try {
		return { meta }
	} catch (error) {
		console.error(error)
		return { meta }
	}
}

export default function CV() {
	const { meta } = useLoaderData<typeof loader>()

	return (
		<>
			<h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>
			<UnderConstruction nav={<Nav />} footer={<Footer />} />
		</>
	)
}
