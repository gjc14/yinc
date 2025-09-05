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
