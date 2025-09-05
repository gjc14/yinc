# Blog dashboard

This is the page where posts are listed. Clicking through posts will navigate to
editor of a single post.

# Structure

To make the dashboard preview what will render, it uses component from the web.

```tsx
const ThisIsPostEditPage = () => {
	return (
		// Context includes POST (title, content, slug...), TAGS, CATEGORIES, EDITOR
		<Context>
			{/* PostComponent is from web/blog/components/post */}
			<PostComponent></PostComponent>
			{/* PostEditorSidebar is from dashboard/blog/components/post */}
			<PostEditorSidebar></PostEditorSidebar>
		</Context>
	)
}
```
