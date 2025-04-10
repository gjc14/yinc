import {
	Outlet,
	type LoaderFunctionArgs,
	type MetaFunction,
} from 'react-router'

import { MainWrapper } from '~/components/wrappers'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'

import { Footer } from '../components/footer'
import { Nav } from '../components/nav'
import { CTA } from './components/cta'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	if (!data || !data.meta) {
		return []
	}

	return data.meta.metaTags
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { seo } = await getSEO(new URL(request.url).pathname)
	const meta = seo ? createMeta(seo, new URL(request.url)) : null

	return { meta }
}

export default function Blog() {
	return (
		<>
			<Nav />
			<MainWrapper>
				<Outlet />
				<CTA />
				<Footer />
			</MainWrapper>
		</>
	)
}
