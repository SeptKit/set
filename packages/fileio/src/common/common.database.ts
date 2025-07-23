export const DATABASE_DEFAULT_SCHEMA =
	'++id, &attributes.uuid, &attributes.id, attributes.name, parent.id, parent.tagName, *children.id, *children.tagName'

/**
 * Generate the schema for the database based on TAG_NAMES
 * @returns Schema for the database based on TAG_NAMES
 */
export function tagNamesToSchema(tagNames: string[]): Record<string, string> {
	return tagNames.reduce((schema, tagName) => {
		schema[tagName] = DATABASE_DEFAULT_SCHEMA
		return schema
	}, {} as Record<string, string>)
}
