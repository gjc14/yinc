/**
 * Contains the SEO part of the post editor.
 * It includes the SEO title and SEO description fields.
 */
import { toast } from '@gjc14/sonner'
import { useAtom } from 'jotai'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Loading } from '~/components/loading'
import { MultiSelect } from '~/components/multi-select'
import type { PostWithRelations } from '~/lib/db/post.server'
import { generateSeoDescription } from '~/lib/utils/seo'

import { editorAtom, postAtom } from '../../context'
import { TinyLinkButton } from './tiny-link-button'

export const SeoPart = () => {
	const [post, setPost] = useAtom(postAtom)
	const [editor] = useAtom(editorAtom)

	if (!editor || !post) return <Loading />

	const handleTitle = () => {
		setPost(prev => {
			if (!prev) return prev
			const newPost = {
				...prev,
				seo: {
					...prev.seo,
					metaTitle: post.title,
				},
			} satisfies PostWithRelations
			return newPost
		})
	}

	const handleDesc = () => {
		setPost(prev => {
			if (!prev) return prev
			const text = editor.getText() || ''
			if (!text) {
				toast.error('No content to generate SEO description')
				return prev
			}
			const newPost = {
				...prev,
				seo: {
					...prev.seo,
					metaDescription: generateSeoDescription(text),
				},
			} satisfies PostWithRelations
			return newPost
		})
	}

	return (
		<>
			<div>
				<Label htmlFor="seo-title">
					SEO Title
					<TinyLinkButton title="Copy Title" onClick={handleTitle} />
				</Label>
				<div className="flex items-center gap-1.5">
					<Input
						id="seo-title"
						name="seo-title"
						type="text"
						placeholder="Meta tilte should match Title (H1) for SEO."
						value={post.seo.metaTitle || ''}
						onChange={e => {
							setPost(prev => {
								if (!prev) return prev
								const newPost = {
									...prev,
									seo: {
										...prev.seo,
										metaTitle: e.target.value,
									},
								} satisfies PostWithRelations
								return newPost
							})
						}}
					/>
				</div>
			</div>

			<div>
				<Label htmlFor="seo-description">
					SEO Description
					<TinyLinkButton title="Copy from post" onClick={handleDesc} />
				</Label>
				<Textarea
					id="seo-description"
					name="seo-description"
					rows={3}
					placeholder="Short description about your post..."
					value={post.seo.metaDescription ?? ''}
					onChange={e => {
						setPost(prev => {
							if (!prev) return prev
							const newPost = {
								...prev,
								seo: {
									...prev.seo,
									metaDescription: e.target.value,
								},
							} satisfies PostWithRelations
							return newPost
						})
					}}
				/>
			</div>

			<div>
				<Label htmlFor="seo-keywords">SEO Keywords</Label>
				<MultiSelect
					options={[]}
					selected={(post.seo.keywords ?? '')
						.split(',')
						.map(k => k.trim())
						.filter(k => k !== '')
						.map(k => ({ label: k, value: k }))}
					onSelectedChange={selectedArr => {
						const keywords = selectedArr.map(s => s.label).join(', ')
						setPost(prev => {
							if (!prev) return prev
							return {
								...prev,
								seo: {
									...prev.seo,
									keywords,
								},
							}
						})
					}}
				/>
			</div>
		</>
	)
}
