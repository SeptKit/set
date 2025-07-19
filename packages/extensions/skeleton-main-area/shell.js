export default function start(rootId, api) {
	const root = document.getElementById(rootId)
	if (!root) {
		console.error({ msg: 'could not found root element', rootId })
		return
	}

	api.activeFileName.subscribe((newFile, oldFile) => {
		console.debug({ msg: 'active file has changed', newFile, oldFile })
		render(root, newFile)
	})

	render(root, api.activeFileName.value)
}

/**
 *
 * @param {HTMLElement} root
 * @param {string} activeFileName
 */
function render(root, activeFileName) {
	root.innerHTML = `
		<h2> Skeleton (Main Area) </h2>
		<h3> Active file: ${activeFileName} </h3>
		<p> This is a skeleton plugin to be displayed in the main area.</p>
	`
}
