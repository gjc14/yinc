import camelCase from 'lodash/camelCase'

/**
 * Converts an object with snake_case keys to camelCase keys recursively.
 * @param obj Object with snake_case keys
 * @returns Object with camelCase keys
 */
export function snakeToCamel<T>(obj: T): T extends (infer U)[]
	? ReturnType<typeof snakeToCamel<U>>[]
	: T extends Record<string, any>
		? {
				[K in keyof T as CamelCase<K & string>]: ReturnType<
					typeof snakeToCamel<T[K]>
				>
			}
		: T {
	// Handle primitives, null, and Date objects
	if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
		return obj as any
	}

	// Handle arrays
	if (Array.isArray(obj)) {
		return obj.map(item => snakeToCamel(item)) as any
	}

	// Handle objects
	const result: Record<string, any> = {}
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const camelKey = camelCase(key)
			const value = obj[key]

			// Only recurse if value is a non-null object
			result[camelKey] =
				value !== null && typeof value === 'object'
					? snakeToCamel(value)
					: value
		}
	}

	return result as any
}

// Helper type for camelCase conversion (TypeScript 4.1+)
type CamelCase<S extends string> =
	S extends `${infer P1}_${infer P2}${infer P3}`
		? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
		: S
/**
 * Convert specified key names' types to Date.
 */
type ConvertToDate<T, K extends string> = T extends (infer U)[]
	? ConvertToDate<U, K>[] // handle arrays
	: T extends Record<string, any>
		? {
				[P in keyof T]: P extends K
					? Date // if the key matches, change the type to Date
					: ConvertToDate<T[P], K> // otherwise recurse
			}
		: T // primitive types remain unchanged

/**
 * Union-type version: supports multiple date fields.
 */
type ConvertDateFields<
	T,
	K extends string = 'createdAt' | 'updatedAt',
> = ConvertToDate<T, K>

/**
 * Converts specified string fields to Date objects recursively.
 * @param obj Object to process
 * @param dateFields Array of field names that should be converted to Date objects
 * @returns Object with specified fields converted to Date objects
 */
export function convertDateFields<
	T,
	K extends string = 'createdAt' | 'updatedAt',
>(obj: T, dateFields?: K[]): ConvertDateFields<T, K> {
	const fieldsToConvert = dateFields ?? (['createdAt', 'updatedAt'] as K[])

	if (obj === null || typeof obj !== 'object') {
		return obj as ConvertDateFields<T, K>
	}

	if (Array.isArray(obj)) {
		return obj.map(item =>
			convertDateFields(item, fieldsToConvert),
		) as ConvertDateFields<T, K>
	}

	const result: Record<string, any> = {}

	for (const [key, value] of Object.entries(obj)) {
		if (
			fieldsToConvert.includes(key as K) &&
			value !== null &&
			value !== undefined
		) {
			// Convert to Date if it's a date field and value exists
			try {
				result[key] = new Date(value as string | number)
			} catch (error) {
				// If conversion fails, still create Date object (might be Invalid Date)
				console.warn(`Failed to convert ${key} to Date:`, value)
				result[key] = new Date(value as string | number)
			}
		} else if (value !== null && typeof value === 'object') {
			// Recursively process nested objects
			result[key] = convertDateFields(value, fieldsToConvert)
		} else {
			// Keep original value
			result[key] = value
		}
	}

	return result as ConvertDateFields<T, K>
}
