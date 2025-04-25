import type { Route } from './+types/route'

export async function loader({ params }: Route.LoaderArgs) {
	const { whateverParam } = params
	console.log('whateverParam', whateverParam)

	return { whateverParam }
}

export default function Param({ loaderData }: Route.ComponentProps) {
	const { whateverParam } = loaderData

	return (
		<div className="border-2">
			<p>
				This content is from <strong>param.tsx</strong> file.
				<br />
				whateverParam: {whateverParam}
			</p>
		</div>
	)
}
