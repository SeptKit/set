import { genericElementBuilder } from '../builder.generic'
// TYPES
import type { BuilderContext } from '../builder.types'

export function LNodeBuilder(context: BuilderContext<'LNode'>) {
	return function (id?: string) {
		const genericBuilder = genericElementBuilder(context)(id)

		function connectTo() {
			console.log('hello from LNodeBuilder.connectTo')
			return genericBuilder.next(context)
		}

		// Return the generic builder with the extension
		return {
			...genericBuilder,
			connectTo,
		}
	}
}
