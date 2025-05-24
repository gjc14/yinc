# Papa

<!-- prettier-ignore -->
> [!NOTE]
> Welcome to Papa, this is an open-source project for building modern web with React and TypeScript.

## Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/home/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **Storage**:
  [Cloudflare R2](https://www.cloudflare.com/zh-tw/developer-platform/products/r2/)
- **Style**: [tailwindcss](https://tailwindcss.com/)
- **UI LIbrary**: [shadcn/ui](https://ui.shadcn.com/)
- **Email SDK**: [Resend](https://resend.com/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Text Editor**: [Tiptap](https://tiptap.dev/)

<!-- prettier-ignore -->
> [!NOTE]
> Optimized for performance, start with **score 100**, tested by [PageSpeed](https://pagespeed.web.dev/).

---

## Before you start

1. Prepare an useful IDE. (e.g.
   [Visual Studio Code](https://code.visualstudio.com/))
2. Get a PostgreSQL database, either host locally or use
   [Neon](https://neon.tech/), which provides 0.5G storage for up to 10
   projects. 512MB is capable of more than 17,000 of
   [What is Papa (30kB)](https://papacloud.vercel.app/blog/what-is-papa) post.
3. Have a [Resend](https://resend.com/) account to send email. Every Resend
   account has a [free 3,000 emails/mo quota](https://resend.com/pricing).
4. Setup an object storage either in
   [Cloudflare R2 (10GB free tier)](https://www.cloudflare.com/developer-platform/products/r2/)
   or [AWS S3](https://aws.amazon.com/s3/).
5. Have either
   [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/),
   [reCAPTCHA v3](https://www.google.com/recaptcha/about/) (coming soon) or
   [hCaptcha](https://www.hcaptcha.com/) (coming soon) to secure your form.
6. Chose where to deploy your Papa application.

### Set up [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/)

1. Navigate to `Cloudflare dashboard > R2 Object Storage`.
2. `{} API > Manage API Tokens`: Click **Create API Token** button, and set
   Permissions to Admin Read & Write and TTL to Forever.
3. Paste it into `.env` as `OBJECT_STORAGE_ACCESS_KEY_ID`,
   `OBJECT_STORAGE_SECRET_ACCESS_KEY`.
4. As for `OBJECT_STORAGE_ACCOUNT_ID`, you will find it by opening
   `{} API > Use R2 with APIs`.
5. In `.env` please configure your desired `BUCKET_NAME`, papa will create a
   bucket with this given name, default to `papa`.

### Set up [AWS S3](https://aws.amazon.com/s3/)

Coming soon

---

## Usage

### 1. Clone and configure the required environment variables

```sh
# Clone the repo
git clone https://github.com/gjc14/papa.git

# Navigate to project and copy .env.example
cd papa && mv .env.example .env
```

<!-- prettier-ignore -->
> [!WARNING]
> VITE will expose any environment variable with _VITE_\_ prefix, please use it carefully.

1.  `DATABASE_URL`: We connect to PostgreSQL using node-postgres (pg), so both
    direct and pooled connections are supported.

    - Direct connections provide a one-to-one connection from your app to the
      database. They are ideal for long-lived environments like VMs or
      containers.
    - Pooled connections (e.g., via PgBouncer in transaction or session pooling
      mode) allow sharing a limited number of database connections across many
      stateless requests. This is especially important when running on
      serverless platforms, where each request may create a new database
      connection.

    - **When using stateless/serverless architecture, we recommend using pooled
      connections to avoid hitting connection limits and to ensure
      scalability.**

2.  (optional) Set `TURNSTILE_SITE_KEY`: This key is used to
    [get Turnstile token](https://developers.cloudflare.com/turnstile/get-started/)
    in client, if you use
    [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) as
    captcha, so should be exposed in the frontend with _VITE_\_ prefix.
3.  (optional) `TURNSTILE_SECRET_KEY`: Used to
    [verify Turnstile token](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
    get in the frontend in the backend
4.  `AUTH_SECRET`: Use
    `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`
    to generate a random secret with node.
5.  `AUTH_EMAIL`: The email address sending authentication emails.
6.  `VITE_BASE_URL`: This is the domain where you're hosting this app. In dev
    mode, probably `http://localhost:5173`. In production environment, please
    use where your app is. E.g. `https://papa.delicioso`.
7.  `APP_NAME`: What you call your app.
8.  `RESEND_API_KEY`: Send emails via Resend.
9.  (optional) `GOOGLE_GENERATIVE_AI_API_KEY`, `OPENAI_API_KEY`,
    `ANTHROPIC_API_KEY`: For use of Generative AI in `/admin/api/ai`
10. `BUCKET_NAME`,`OBJECT_STORAGE_ACCESS_KEY_ID`,
    `OBJECT_STORAGE_SECRET_ACCESS_KEY`, `OBJECT_STORAGE_ACCOUNT_ID`: Where you
    save your objects, accept S3 compatible services. Using in route
    `/admin/assets/resource`

### 2. Install and push database schema

```sh
npm install
```

### 3. Initialize the project

This command will start the project by adding an admin with default posts.

You will be asked for **Email** and your **Name**. Enter them in the teminal.

- If you have already init the project:

```sh
npm run dev
```

- If you're starting a new project:

```sh
npm run init
```

🎉 Now your project should be running on
[http://localhost:5173](http://localhost:5173). Go to
[http://localhost:5173/admin](http://localhost:5173/admin), sign in to see the
admin panel.

---

# Documents

## Routes

<!-- prettier-ignore -->
> [!IMPORTANT]
> All `routes.ts` will runs at the same level of your `vite.config.ts` and is not part of bundle. Therefore, please use relative paths to import your routes, avoiding `~/your/route/config/path`.
> More details please refer to this [react router issue](https://github.com/remix-run/react-router/issues/12706).

**Config files:**

1. Admin routes are configured in `/app/routes/papa/admin/routes.ts`
2. Web routes are configured in `/app/routes/web/routes.ts`

### Web Route

TODO

### Admin Route

You may run `npm run create-plugin:admin` to generate the example routes.

These actions will be done:

1. Generate example admin route
2. Generate example admin sub route
3. Generate papa config file for nav
4. Generate example routes config
5. Modify `/app/routes/papa/admin/routes.ts` file

```tsx
// /app/routes/plugins/example-plugin/routes.ts
import { type RouteConfig } from '@react-router/dev/routes'

// This should be imported and used as `...customizedAdminRoutes` in `customizedRoutes` of `/app/routes/papa/admin/routes.ts`
export const customizedAdminRoutes = [
	// write your admin routes here, route should either:
	// 1. relative path: `route('custom-route', './where/your/file.tsx')` , which will automatically render under `/admin/custom-route`.
	// 2. direct path start with `/admin`: `route('/admin/custom-route', './where/your/file.tsx')`
] satisfies RouteConfig
```

In `/app/routes/papa/admin/routes.ts` for example:

```tsx
// /app/routes/papa/admin/routes.ts
import { customizedAdminRoutes } from '../../plugins/example-plugin/routes.ts'

// Configure your customized routes here
const customizedRoutes = [
	// Add your customized routes here
	...customizedAdminRoutes,
] satisfies RouteConfig

// ... other codes
```

### Advanced

To add customized routes in this project, just defines a `routes.ts` in the
top-level of your plugin folder. Defines with
[React Router Routes](https://reactrouter.com/start/framework/routing)

```tsx
// /app/routes.ts
import { route, type RouteConfig } from '@react-router/dev/routes'

// 1. Define your routes
const myRoutes = [
	// route('the-parent', './path/to/route.tsx', [
	//      // children routes will be rendered if parent route has <Outlet />
	//      index('./path/to/index-route.tsx')
	//      route('the-child', './path/to/child-route.tsx', [
	//          // It is also able to add children in children
	//      ])
	// ])
] satisfies RouteConfig

// 2. Add it to default
export default [...systemRoutes, ...myRoutes]
```

## Action

### Conventional Return

Refer to: [Definitions in lib/utils](./app/lib/utils/index.tsx)

```ts
return { msg: 'Action success 🎉' } satisfies ConventionalActionResponse
return { err: 'Something went wrong 🚨' } satisfies ConventionalActionResponse
```

```ts
import { type ActionFunctionArgs } from 'react-router'

import { type ConventionalActionResponse } from '~/lib/utils'

type ReturnData = {
	name: string
}

export const action = async ({ request }: ActionFunctionArgs) => {
	if (a) {
		return {
			msg: `Welcome to PAPA!`,
			data: { name: newName },
		} satisfies ConventionalActionResponse<ReturnData>
	} else {
		return {
			err: 'Method not allowed',
		} satisfies ConventionalActionResponse
	}
}

// If you use fetcher, you could benefit from the generic return data
const fetcher = useFetcher<typeof action>()

useEffect(() => {
	if (fetcher.status === 'loading' && fetcher.data.data) {
		const returnedData = fetcher.data.data // Typed ReturnType
	}
}, [fetcher])
```

## Auth

### Hierarchy

```ts
Organization
├── (Team)
└── └── Member
```

### Sign Up

- For new admin user, they should always be invited/added by current admin.

### Sign In

- For safety concern, now only OTP method is available.

## Admin Components

### Data Table

- Reference:
  [Tanstack Table Columns Definitions Guide](https://tanstack.com/table/latest/docs/guide/column-defs)

```tsx
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '~/routes/papa/admin/components/data-table'

type TagType = {
    name: string
    id: string
    postIds: string[]
}

const tags: TagType[] = [
    {
        name: 'Travel',
        id: 'unique-id-1',
        postIds: ['post-1', 'post-2', 'post-3'],
    },
    {
        name: 'Education',
        id: 'unique-id-2',
        postIds: ['post-4', 'post-5', 'post-6'],
    },
]

const tagColumns: ColumnDef<TagType>[] = [
    {
        // accessorKey is the key of the data your pass into <DataTable>
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'postIds',
        header: 'Posts',
        cell: ({ row }) => {
            // `row.original` gives you tags data you pass into <DataTable>
            return row.original.postIds.length
        },
    },
    {
        // If header is a function, please pass in id key.
        // Some of the functions refer to "id" to display as column header,
        // when header is not a string
        id: 'Action',
        accessorKey: 'id',
        header: () => <div className="w-full text-right">Action</div>,
        cell: ({ row }) => (
            <div className="w-full flex">
                <DeleteTaxonomyButton
                    id={row.original.id}
                    actionRoute={'/admin/blog/taxonomy/resource'}
                    intent={'tag'}
                />
            </div>
        ),
    },
]

// Usage
<DataTable columns={tagColumns} data={tags} />
```

### Data Table with customized conditional row style

```tsx
export function MyComponent() {
	const [rowsDeleting, setRowsDeleting] = useState<Set<string>>(new Set())

	return (
		<DataTable
			columns={columns}
			// Pass in rowsDeleting set state into table
			data={users.map(u => ({
				...u,
				setRowsDeleting,
			}))}
			// Configure style if row id matches rowsDeleting
			rowGroupStyle={[
				{
					rowIds: rowsDeleting,
					className: 'opacity-50 pointer-events-none',
				},
			]}
			hideColumnFilter
		>
			{/* DataTable passes a table ref for you to use table api, and this will be rendered above table in toolbox */}
			{table => (
				<Input
					placeholder="Filter email..."
					value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn('email')?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			)}
		</DataTable>
	)
}
```

### Admin Wrapper

```tsx
export default function AdminExample() {
	return (
		<AdminSectionWrapper>
			<AdminHeader>
				<AdminTitle title="Your admin title"></AdminTitle>
				<AdminActions>{/* You may put some buttons here */}</AdminActions>
			</AdminHeader>
			{/* Your main content goes here */}
			<AdminContent>Main content</AdminContent>
		</AdminSectionWrapper>
	)
}
```
