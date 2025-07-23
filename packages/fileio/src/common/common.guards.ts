import type { Attribute, QualifiedAttribute } from './common.types'

export function isQualifiedAttribute(
	attribute: Attribute | QualifiedAttribute | null
): attribute is QualifiedAttribute {
	return attribute !== null && typeof attribute === 'object' && 'namespace' in attribute
}
