import { route } from '@react-router/dev/routes'

import type { Service } from '~/routes/papa/utils/service-configs'

export const config = {
	routes: [route('/cv.0', './routes/services/cv/index/route.tsx')],
} satisfies Service
