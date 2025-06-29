import { useLoaderData, type LoaderFunctionArgs } from 'react-router'

import { statusCodeMap } from '~/lib/utils/status-code'

// Usage: papa.cloud/assets/my-file-key?visibility=public
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { searchParams } = new URL(request.url)

	const status = searchParams.get('status')
	const statusText =
		searchParams.get('statusText') ||
		statusCodeMap[isNaN(Number(status)) ? 500 : Number(status)].text

	return { status, statusText }
}

export default function AssetsError() {
	const { status, statusText } = useLoaderData<typeof loader>()

	return (
		<div className="h-svh w-screen grow flex flex-col items-center justify-center">
			<h1>Asset Error</h1>
			<p>
				{status || 'Unknown status code'} | {statusText}
			</p>
		</div>
	)
}
