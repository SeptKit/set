import type { API } from './extension-api'

export type InitFn = () => Extension

export type Extension = {
	id: string
	label: string
	contributions: Contributions
}

export type Contributions = (WidgetContribution | MenuContribution)[]

export type WidgetContribution = Contribution & {
	type: 'widget'
	icon: string
	location: 'mainArea' | 'primarySidebar' | 'secondarySidebar'
	start: (rootId: string, api: API) => void
}

type MenuContribution = Contribution & {
	type: 'menubar'
	// e.g "/" for main item: "file/edit" to display the label "File > Edit > {label}"
	menuPath: string
	action: () => void
}

type Contribution = {
	id: string
	type: 'widget' | 'menubar'
	label: string
}
