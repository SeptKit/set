export type NavBarItem = {
	id: string
	label: string
	path: string[]
	action: ActionFn
}

export type ActionFn = (id: string) => void
