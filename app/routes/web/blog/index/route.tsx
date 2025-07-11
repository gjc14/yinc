import type { Route } from './+types/route'

import { SectionWrapper } from '../components/max-width-wrapper'
import { PostCollection } from '../components/posts'

export default function Index({ matches }: Route.ComponentProps) {
	const { meta, posts, categoriesFilter, tagsFilter } = matches[2].data

	const isCategoryFiltering = categoriesFilter && categoriesFilter.length > 0
	const isTagFiltering = tagsFilter && tagsFilter.length > 0
	const title =
		isCategoryFiltering || isTagFiltering
			? `Blog - Filtered by ${isCategoryFiltering ? `category: ${categoriesFilter.map(cat => cat.name).join(', ')}` : ''}${isTagFiltering ? ` & tag: ${tagsFilter.map(tag => tag.name).join(', ')}` : ''}`
			: 'Blog - All Posts'

	return (
		<>
			<h1 className="visually-hidden">{meta?.seo.metaTitle}</h1>
			<SectionWrapper className="mt-28">
				<PostCollection
					title={title}
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
