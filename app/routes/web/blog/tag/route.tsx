import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { getPosts } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { createMeta } from '~/lib/utils/seo'
import { SectionWrapper } from '../components/max-width-wrapper'
import { PostCollection } from '../components/posts'

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
    if (!data || !data.meta) {
        return []
    }

    return data.meta.metaTags
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { seo } = await getSEO(new URL(request.url).pathname)
    const meta = seo ? createMeta(seo, new URL(request.url)) : null
    const query = params.query ?? ''

    try {
        const { posts } = await getPosts({
            status: 'PUBLISHED',
            tagFilter: [query],
        })
        return { meta, posts, query }
    } catch (error) {
        console.error(error)
        return { meta, posts: [], query }
    }
}

export default function Tag() {
    const { meta, posts, query } = useLoaderData<typeof loader>()

    return (
        <>
            <h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>
            <SectionWrapper className="mt-28">
                <PostCollection
                    title={`Listing ${
                        posts.length !== 0
                            ? `${posts.length}${
                                  posts.length === 0 ? ' post' : ' posts'
                              } in ${query}`
                            : 'all posts'
                    }`}
                    posts={posts.map(post => {
                        return {
                            ...post,
                            createdAt: new Date(post.createdAt),
                            updatedAt: new Date(post.updatedAt),
                        }
                    })}
                />
            </SectionWrapper>
        </>
    )
}
