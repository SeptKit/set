import type { AvailableElement, AvailableAttribute } from '../standard/standard.types'
import type { EntityTable } from 'dexie'
import type { Dexie } from 'dexie'

export type Relationship = {
	id: string
	tagName: AvailableElement
}

export type DatabaseAttribute<GenericElement extends AvailableElement> = {
	name: AvailableAttribute<GenericElement>
	value: string
}

export type Namespace = {
	prefix: string
	uri: string
}

export type DatabaseQualifiedAttribute<GenericElement extends AvailableElement> =
	DatabaseAttribute<GenericElement> & {
		namespace: Namespace | null
	}

export type DatabaseRecord<GenericElement extends AvailableElement> = {
	id: string
	tagName: AvailableElement
	namespace: Namespace | null
	attributes: Array<DatabaseQualifiedAttribute<GenericElement>>
	value: string | null
	parent: Relationship | null
	children: Relationship[]
}

export type DatabaseInstance = Dexie & {
	[tableName in AvailableElement]: EntityTable<DatabaseRecord<tableName>, 'id'>
}
