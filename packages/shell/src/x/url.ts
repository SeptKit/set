export function generateLocationBasedFileUrl(relativeFileUrl: string, baseUrl: string): string {
	const baseUrlObj = new URL(baseUrl)

	const startFnFile = relativeFileUrl.replace('/', '')
	const pathParts = baseUrlObj.pathname.split('/').filter(Boolean)
	pathParts.push(startFnFile)
	pathParts.unshift(baseUrlObj.origin)
	const fullPath = pathParts.join('/')

	return fullPath
}
