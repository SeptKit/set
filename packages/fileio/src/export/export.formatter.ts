export function formatXml(xmlString: string) {
	const PADDING = '  ' // 2 spaces per indent
	const reg = /(>)(<)(\/*)/g
	let xml = xmlString.replace(reg, '$1\r\n$2$3')
	let pad = 0
	return xml
		.split('\r\n')
		.map((node) => {
			if (node.match(/^<\/\w/)) pad--
			const indent = PADDING.repeat(pad)
			if (node.match(/^<[^!?]/) && !node.match(/\/>$/) && !node.match(/^<\/\w/)) pad++
			return indent + node
		})
		.join('\n')
}
