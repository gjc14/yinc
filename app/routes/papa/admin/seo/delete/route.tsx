import { ActionFunctionArgs } from '@remix-run/node'

import { userIs } from '~/lib/db/auth.server'
import { deleteSEO } from '~/lib/db/seo.server'
import { ConventionalActionResponse } from '~/lib/utils'

export const action = async ({ request, params }: ActionFunctionArgs) => {
    if (request.method !== 'DELETE') {
        return Response.json({
            err: 'Method not allowed',
        } satisfies ConventionalActionResponse)
    }

    await userIs(request, ['ADMIN'])

    const id = params.seoId

    if (!id || Number.isNaN(Number(id))) {
        console.log('Invalid arguments', id)
        return Response.json({
            err: `Invalid arguments`,
        } satisfies ConventionalActionResponse)
    }

    try {
        const { seo } = await deleteSEO(Number(id))
        return Response.json({
            msg: `SEO for ${seo.route || seo.metaTitle || 'unknown'} delete`,
        } satisfies ConventionalActionResponse)
    } catch (error) {
        console.error(error)
        return Response.json({
            err: 'Failed to delete SEO',
        } satisfies ConventionalActionResponse)
    }
}
