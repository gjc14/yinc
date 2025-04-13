import { redirect } from 'react-router'

import type { Route } from './+types/route'

export const loader = async ({ params }: Route.LoaderArgs) => {
	return redirect('/admin/blog/' + params.postSlug)
}
