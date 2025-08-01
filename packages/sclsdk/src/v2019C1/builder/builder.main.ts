import { genericElementBuilder } from './builder.generic'
// STANDARD
import { DEFINITION } from '../standard/standard.definition'
// DATABASE
import { initializeDatabaseInstance } from '../database/database.instance'
// TYPES
import type { AvailableElement } from '../standard/standard.types'
import type { BuilderContext } from './builder.types'

export function scl(params: { databaseName: string }) {
	const { databaseName } = params

	const databaseInstance = initializeDatabaseInstance({
		databaseName: databaseName,
	})

	function getInitialContext<GenericElement extends AvailableElement>(
		tagName: GenericElement,
	): BuilderContext<GenericElement> {
		return {
			database: {
				name: databaseName,
				instance: databaseInstance,
				operations: [],
			},
			standard: {
				definition: DEFINITION,
			},
			current: {
				tagName: tagName,
				elements: [],
				lastOperationType: 'single',
			},
		}
	}

	function entrypoint<GenericElement extends AvailableElement>(
		tagName: GenericElement,
		id?: string,
	) {
		return genericElementBuilder(getInitialContext(tagName))(id || undefined)
	}

	return { entrypoint }
}
