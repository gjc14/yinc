import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '~/lib/db/db.server' // your drizzle instance

const appName = process.env.APP_NAME ?? 'PAPA'
const baseURL = process.env.VITE_BASE_URL ?? 'http://localhost:5173'

export const auth = betterAuth({
    appName,
    baseURL,
    database: drizzleAdapter(db, {
        provider: 'pg',
    }),
    emailAndPassword: {
        enabled: false,
    },
})
