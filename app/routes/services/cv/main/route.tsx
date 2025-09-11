import type { Route } from './+types/route'

export async function loader({ request }: Route.LoaderArgs) {
	const origin = new URL(request.url).origin
	const assetUrl = `${origin}/cv/CHIU_YIN_CHEN_resume.pdf`

	// Fetch the PDF content internally
	const pdfResponse = await fetch(assetUrl)

	return new Response(pdfResponse.body, {
		status: pdfResponse.status,
		headers: pdfResponse.headers,
	})
}
