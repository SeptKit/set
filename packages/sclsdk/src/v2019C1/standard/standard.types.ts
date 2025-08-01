import { DEFINITION } from './standard.definition'

export type AvailableElement = keyof typeof DEFINITION

export type AvailableAttribute<GenericElement extends AvailableElement> =
	(typeof DEFINITION)[GenericElement]['attributes']['available'][number]

export type AvailableAttributeMap<GenericElement extends AvailableElement> = {
	[Key in GenericElement]: AvailableAttribute<GenericElement>
}

export type AvailableSubElement<GenericElement extends AvailableElement> =
	(typeof DEFINITION)[GenericElement]['subElements']['available'][number]

export type AvailableSubElementMap<GenericElement extends AvailableElement> = {
	[Key in GenericElement]: AvailableSubElement<GenericElement>
}

export type Element<GenericElement extends AvailableElement> = (typeof DEFINITION)[GenericElement]

export type AttributeDetails<GenericElement extends AvailableElement> =
	(typeof DEFINITION)[GenericElement]['attributes']['details']

export type SubElementDetails<GenericElement extends AvailableElement> =
	(typeof DEFINITION)[GenericElement]['subElements']['details']
