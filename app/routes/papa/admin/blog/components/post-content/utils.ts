/**
 * This function converts string dates to Date objects in a given object or array.
 * @param obj - The object or array to be processed.
 * @returns The processed object or array with string dates converted to Date objects.
 */
export const convertStringDatesToDateObjects = (obj: any): any => {
	if (obj === null || typeof obj !== 'object') {
		return obj
	}

	if (Array.isArray(obj)) {
		return obj.map(item => convertStringDatesToDateObjects(item))
	}

	const newObj: { [key: string]: any } = {}
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key]
			if (
				(key === 'createdAt' || key === 'updatedAt') &&
				typeof value === 'string'
			) {
				const date = new Date(value)
				// Check if the date is valid before assigning
				newObj[key] = isNaN(date.getTime()) ? value : date
			} else if (typeof value === 'object') {
				newObj[key] = convertStringDatesToDateObjects(value)
			} else {
				newObj[key] = value
			}
		}
	}
	return newObj
}
