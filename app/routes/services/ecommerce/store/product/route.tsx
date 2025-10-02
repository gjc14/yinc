import type { Route } from './+types/route'

export const action = async ({ request, params }: Route.ActionArgs) => {
	return {}
}

export const loader = async ({ request, params }: Route.LoaderArgs) => {
	return {}
}

export default function ProductPage({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	return <div></div>
}
