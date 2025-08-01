import type { DatabaseInstance, DatabaseRecord } from '../database/database.types'
import type { DEFINITION } from '../standard/standard.definition'
import type { AvailableElement } from '../standard/standard.types'

export type BuilderContext<GenericElement extends AvailableElement> = {
	database: DatabaseBuilderContext<GenericElement>
	standard: StandardBuilderContext
	current: CurrentBuilderContext<GenericElement>
}

export type DatabaseBuilderContext<GenericElement extends AvailableElement> = {
	name: string
	instance: DatabaseInstance
	initialContext?: BuilderContext<GenericElement>
	operations: BuilderOperation<GenericElement>[]
}

export type StandardBuilderContext = {
	definition: typeof DEFINITION
}

export type CurrentBuilderContext<GenericElement extends AvailableElement> = {
	tagName: GenericElement
	elements: DatabaseRecord<GenericElement>[]
	lastOperationType: 'single' | 'bulk'
}

export type BuilderOperation<GenericElement extends AvailableElement> = {
	usedTables: Array<GenericElement>
	isEntryPoint?: boolean
	callback: (context: BuilderContext<GenericElement>) => Promise<BuilderContext<GenericElement>>
}
