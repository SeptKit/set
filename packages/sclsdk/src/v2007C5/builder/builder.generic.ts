import { DEFINITION } from '../standard/standard.definition'
// DATABASE
import { liveQuery } from 'dexie'
// TYPES
import type { AvailableElement, AvailableSubElement } from '../standard/standard.types'
import type { DatabaseRecord, DatabaseAttribute } from '../database/database.types'
import type { BuilderOperation, BuilderContext } from './builder.types'

export function genericElementBuilder<GenericElement extends AvailableElement>(
	context: BuilderContext<GenericElement>,
) {
	function builderEntrypoint(id?: string) {
		// setting initial context
		let newContext = {
			...context,
			database: {
				...context.database,
				initialContext: context,
			},
		}

		newContext.database.operations = [
			...newContext.database.operations,
			{
				usedTables: [newContext.current.tagName],
				isEntryPoint: true,
				callback: async (context: BuilderContext<GenericElement>) => {
					let elements: DatabaseRecord<GenericElement>[] = []
					if (id)
						elements = (await context.database.instance[context.current.tagName]
							.where({ id })
							.toArray()) as DatabaseRecord<GenericElement>[]
					else
						elements = (await context.database.instance[
							context.current.tagName
						].toArray()) as DatabaseRecord<GenericElement>[]
					return {
						...context,
						current: {
							...context.current,
							elements: elements,
						},
					}
				},
			},
		]

		return next({
			...newContext,
			current: {
				tagName: newContext.current.tagName,
				elements: id
					? [
							{
								id: id,
								tagName: newContext.current.tagName,
								namespace: null,
								attributes: [],
								value: null,
								parent: null,
								children: [],
							},
						]
					: [],
				lastOperationType: 'single',
			},
		})
	}

	function next(newContextChange: BuilderContext<GenericElement>) {
		return genericElementBuilder({
			...context,
			...newContextChange,
		})
	}

	function subscribe(id?: string) {
		if (id) {
			return liveQuery(
				async () =>
					(await context.database.instance[context.current.tagName]
						.where({ id })
						.toArray()) as DatabaseRecord<GenericElement>[],
			)
		} else
			return liveQuery(
				async () =>
					(await context.database.instance[
						context.current.tagName
					].toArray()) as DatabaseRecord<GenericElement>[],
			)
	}

	function addChild<GenericSubElement extends AvailableSubElement<GenericElement>>(params: {
		tagName: GenericSubElement
		attributes: Array<DatabaseAttribute<GenericSubElement>>
	}) {
		const { tagName, attributes } = params
		//const childTagName = params.tagName
		const parentElement = context.current.elements[0]
		const childAttributes = attributes.map((attribute) => ({
			...attribute,
			namespace:
				(attribute.name in DEFINITION[tagName].attributes.details
					? (DEFINITION[tagName].attributes.details as Record<string, any>)[attribute.name]
							?.namespace
					: null) || null,
		}))
		const newChildRecord: DatabaseRecord<GenericSubElement> = {
			id: crypto.randomUUID(),
			tagName,
			namespace: DEFINITION[tagName].namespace || null,
			attributes: childAttributes,
			value: null,
			parent: {
				id: parentElement.id,
				tagName: parentElement.tagName,
			},
			children: [],
		}

		const updatedParentRecord: DatabaseRecord<GenericElement> = {
			...parentElement,
			children: [
				...(parentElement.children || []),
				{
					id: newChildRecord.id,
					tagName: newChildRecord.tagName,
				},
			],
		}

		// Create a new context for the child element with type-safe operations
		// this is necessary to ensure that type inference works correctly
		const newChildContext: BuilderContext<GenericSubElement> = {
			database: {
				name: context.database.name,
				instance: context.database.instance,
				initialContext: undefined,
				operations: [
					...context.database.operations.map((op) => ({
						...op,
						usedTables: op.usedTables as unknown as Array<GenericSubElement>,
						callback: op.callback as any,
					})),
					{
						usedTables: [tagName, parentElement.tagName] as unknown as Array<GenericSubElement>,
						callback: async (context: BuilderContext<GenericSubElement>) => {
							// Use any to bypass strict typing for database operations
							const instance = context.database.instance as any
							await Promise.all([
								instance[tagName].put(newChildRecord),
								instance[parentElement.tagName].put(updatedParentRecord),
							])
							context.current.elements = [newChildRecord]
							return context
						},
					},
				],
			},
			standard: context.standard,
			current: {
				tagName: tagName,
				elements: [newChildRecord],
				lastOperationType: 'single',
			},
		}

		return genericElementBuilder<GenericSubElement>(newChildContext)
	}

	// function bulkAdd(params: {
	// 	childTagName: GenericSubElement
	// 	childAttributes: Array<DatabaseQualifiedAttribute<GenericVersion, GenericSubElement>>
	// }) {
	// const newContext = { ...initializedContext }

	// for (const currentElement of initializedContext.currentElements || []) {
	// 	const { childTagName, childAttributes } = params

	// 	newContext.operations = [
	// 		...newContext.operations,
	// 		{
	// 			type: 'upsert',
	// 			elements: [
	// 				{
	// 					tagName: childTagName as AvailableElement<GenericVersion>,
	// 					attributes: childAttributes,
	// 					parent: {
	// 						id: currentElement.id,
	// 						tagName: currentElement.tagName,
	// 					},
	// 				},
	// 			],
	// 		},
	// 	]
	// }

	// 	return next(context)
	// }

	async function commit(): Promise<DatabaseRecord<GenericElement>[]> {
		const databaseInstance = context.database.instance

		const tablesNeeded = new Set(
			context.database.operations.flatMap(
				(operation: BuilderOperation<GenericElement>) => operation.usedTables as string[],
			),
		)

		return await databaseInstance.transaction('rw', [...tablesNeeded], async () => {
			let newContext = {
				...context,
			}
			let createdRecords: DatabaseRecord<GenericElement>[] = []

			for (const operation of context.database.operations) {
				if (operation.isEntryPoint && newContext.database?.initialContext)
					newContext = await operation.callback(newContext.database.initialContext)
				else newContext = await operation.callback(newContext)
				createdRecords = [...createdRecords, ...newContext.current.elements]
			}

			return createdRecords
		})
	}

	builderEntrypoint.addChild = addChild

	builderEntrypoint.next = next
	builderEntrypoint.subscribe = subscribe
	builderEntrypoint.commit = commit

	return builderEntrypoint
}
