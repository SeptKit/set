export function formatXml(xmlString: string) {
	const PADDING = '  '
	const reg = /(>)(<)(\/*)/g
	let xml = xmlString.replace(reg, '$1\r\n$2$3')
	let pad = 0
	return xml
		.split('\r\n')
		.map((node) => {
			// Remove leading/trailing whitespace
			node = node.trim()

			// Closing tag (handles namespace, e.g. </scl:Substation>)
			if (/^<\/[\w:-]+>/.test(node)) pad--

			const indent = PADDING.repeat(pad)

			// Opening tag (not self-closing, not closing)
			if (
				/^<[\w:-]+[^>]*>/.test(node) && // opening tag
				!node.endsWith('/>') && // not self-closing
				!/^<\/[\w:-]+>/.test(node) // not closing tag
			)
				pad++

			return indent + node
		})
		.join('\n')
}
