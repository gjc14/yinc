# Web Routes - Fallback System

This directory contains the fallback web routes that are automatically included
when there are no services dedicated to handle index(landing page), blog, or
catch-all routes.

## Automatic Fallback Detection

The routing system checks all service configurations and determines which of
these core web routes need fallbacks:

- **Index Route** (`/`) - Landing page
- **Blog Routes** (`/blog/*`) - Blog system with posts, categories, tags
- **Catch-all Route** (`/*`) - 404 handling and wildcard routes

## Fallback Routes

### Index Route (`/`)

**File:** `routes/web/index/route.tsx`

The main landing page of your application. Only included if no service defines
an index route.

### Blog Routes (`/blog/*`)

**File:** `routes/web/blog/`

A complete blog system including:

- `/blog` - Blog homepage
- `/blog/:postSlug` - Individual blog posts
- `/blog/:postSlug/edit` - Blog post editing redirect
- `/blog/category` - Blog categories
- `/blog/tag` - Blog tags
- `/blog/subscribe` - Blog subscription

Only included if no service defines any route starting with `blog` or `blog/`.

### Catch-all Route (`/*`)

**File:** `routes/web/$/route.tsx`

Handles all unmatched routes, typically for 404 pages or dynamic content. Only
included if no service defines a catch-all route with `*`.

## How Services Override Fallbacks

Services can override any fallback route by defining their own routes in their
`config.tsx`:

### Override Index Route

```tsx
export const config: Service = {
	routes: [
		// This will override the web index fallback
		index('./routes/services/my-service/home/route.tsx'),
	],
}
```

### Override Blog Routes

```tsx
export const config: Service = {
	routes: [
		// This will override all blog fallbacks
		route('blog', './routes/services/my-service/blog/layout.tsx', [
			index('./routes/services/my-service/blog/index.tsx'),
			route(':slug', './routes/services/my-service/blog/post/route.tsx'),
		]),
		// This will also override
		route('/blog/post', './routes/services/my-service/blog/post.tsx'),
	],
}
```

### Override Catch-all Route

```tsx
export const config: Service = {
	routes: [
		// This will override the catch-all fallback
		route('*', './routes/services/my-service/404/route.tsx'),
		// or
		route('/*', './routes/services/my-service/404/route.tsx'),
	],
}
```
