import { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { getPosts } from '~/lib/db/post.server'
import { getSEO } from '~/lib/db/seo.server'
import { SectionWrapper } from '../components/max-width-wrapper'
import { PostCollection } from '../components/posts'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return data?.seo
        ? [
              { title: data.seo.metaTitle },
              { name: 'description', content: data.seo.metaDescription },
          ]
        : []
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { seo } = await getSEO(new URL(request.url).pathname)
    const query = params.query ?? ''

    try {
        const { posts } = await getPosts({
            status: 'PUBLISHED',
            tagFilter: [query],
        })
        return { seo, posts, query }
    } catch (error) {
        console.error(error)
        return { seo, posts: [], query }
    }
}

export default function Tag() {
    const { seo, posts, query } = useLoaderData<typeof loader>()

    return (
        <>
            <h1 className="visually-hidden">{seo?.metaTitle}</h1>
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
