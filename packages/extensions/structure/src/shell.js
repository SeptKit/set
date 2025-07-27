import { createApp } from 'vue'
import app from './app.vue'

export default function start(rootId, api) {
	const root = document.getElementById(rootId)
	if (!root) {
		console.error({ msg: 'could not found root element', rootId })
		return
	}

	// api.activeFileName.subscribe((newFile, oldFile) => {
	// 	console.debug({ msg: 'active file has changed', newFile, oldFile })
	// 	render(root, newFile)
	// })

	createApp(app, { api }).mount(`#${rootId}`)
}
