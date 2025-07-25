import type { API } from './extension-api'

export type InitFn = () => Extension

export type Extension = {
	id: string
	label: string
	version: string
	contributions: Contributions
}

export type Contributions = (WidgetContribution | MenuContribution)[]

export type WidgetContribution = Contribution & {
	type: 'widget'
	icon: string
	location: 'mainArea' | 'primarySidebar' | 'secondarySidebar'
	startFnUrl: string // relative to package.json
}

export type StartFn = (rootId: string, api: API) => void

export type MenuContribution = Contribution & {
	type: 'menu'
	// e.g "/" for main item: "file/edit" to display the label "File > Edit > {label}"
	label: string
	icon?: string
	menuPath: string[]
	actionFnUrl: string
}

type Contribution = {
	id: string
	type: 'widget' | 'menu'
	label: string
}
