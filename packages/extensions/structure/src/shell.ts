import { createApp } from 'vue'
import app from './app.vue'

export default function start(rootId: string, api: unknown) {
	const root = document.getElementById(rootId)
	if (!root) {
		console.error({ msg: 'could not found root element', rootId })
		return
	}

	createApp(app, { api }).mount(`#${rootId}`)
}
