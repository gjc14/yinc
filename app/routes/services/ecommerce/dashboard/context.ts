import { atom } from 'jotai'

import type { loader } from '~/routes/papa/dashboard/assets/resource'

export const assetsAtom = atom<Awaited<ReturnType<typeof loader>> | null>(null)
