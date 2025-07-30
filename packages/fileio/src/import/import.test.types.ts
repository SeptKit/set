export type TestCase = {
	description: string
	fileName: string
	fileContent: string
	expectedFileName: string
	expectedElementCounts: { [tableName: string]: number } | undefined
	expectedRelationships?: {
		[tableName: string]: {
			uuid: string
			parent: { uuid: string; tagName: string } | null
			children: { uuid: string; tagName: string }[]
		}[]
	}
}
