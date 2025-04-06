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

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)
    const { seo } = await getSEO(url.pathname)
    const meta = seo ? createMeta(seo, url) : null
    const slug = url.searchParams.get('q')
    if (!slug) return { meta, posts: [], slug: '' }

    try {
        const { posts } = await getPosts({
            status: 'PUBLISHED',
            categoryFilter: [slug],
        })
        return { meta, posts, slug }
    } catch (error) {
        console.error(error)
        return { meta, posts: [], slug }
    }
}

export default function Category() {
    const { meta, posts, slug } = useLoaderData<typeof loader>()

    return (
        <>
            <h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>
            <SectionWrapper className="mt-28">
                <PostCollection
                    title={`${
                        posts.length !== 0
                            ? `Listing ${posts.length} ${
                                  posts.length === 1 ? 'post' : 'posts'
                              } in ${slug}`
                            : 'No posts found'
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
