import type { TAG_NAMES } from './common.constant'
import type { EntityTable } from 'dexie'
import type { Dexie } from 'dexie'

export type Relationship = {
	id: string
	tagName: AvailableTagName
}

export type Attribute = {
	name: string
	value: string
}

export type QualifiedAttribute = Attribute & {
	namespace: {
		prefix: string
		uri: string
	}
}

export type Namespace = {
	prefix: string
	uri: string
}

export type DatabaseRecord = {
	id: string
	tagName: AvailableTagName
	namespace: Namespace | null
	attributes: Array<Attribute | QualifiedAttribute> | null
	value: string | null
	parent: Relationship | null
	children: Relationship[] | null
}

export type AvailableTagName = (typeof TAG_NAMES)[number]
export type DatabaseInstance = Dexie & {
	[tableName in AvailableTagName]: EntityTable<DatabaseRecord, 'id'>
}
