import { redirect } from 'react-router'

import { getFileUrl } from '~/lib/db/asset.server'

export const presignedUrlRes = async (key: string) => {
	const presignedUrl = await getFileUrl(key)

	if (!presignedUrl) {
		console.error('Error when getting presigned URL')
		return redirect(
			'/assets/error' + '?status=500' + '&statusText=Internal Server Error',
		)
	}

	const response = await fetch(presignedUrl)
	if (response.status !== 200) {
		console.error(response.status, response.statusText)

		return redirect(
			'/assets/error' +
				`?status=${response.status}` +
				`&statusText=${response.statusText}`,
		)
	}

	// Proxy the request to the presigned URL
	return response
}
