export default function init() {
	return {
		id: 'ext-skeleton-main-area.sprinteins',
		type: 'widget',
		label: 'Skeleton (Main Area)',
		icon: 'none',
		location: 'mainArea',
		start: (rootId) => {
			const root = document.getElementById(rootId)
			if (!root) {
				console.error({ msg: 'could not found root element', rootId })
				return
			}

			root.innerHTML = `
				<h2> Skeleton (Main Area) </h2>
				<p> This is a skeleton plugin to be displayed in the main area.</p>
			`
		},
	}
}
