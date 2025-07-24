// TYPES
import type { Relationship, AvailableTagName, DatabaseRecord } from '@/common'
import type { NewRelationship } from './import.types'

//====== STATE MANAGEMENT ======//

const pendingChildrenRelationshipsPerParent: Record<AvailableTagName, NewRelationship[]> =
	{} as Record<AvailableTagName, NewRelationship[]>

//====== PUBLIC FUNCTIONS ======//

export function registerPendingChildrenRelationship(params: {
	parent: Relationship
	child: Relationship
}) {
	const { parent, child } = params

	if (!pendingChildrenRelationshipsPerParent[parent.tagName]) {
		pendingChildrenRelationshipsPerParent[parent.tagName] = []
	}

	const newChildRelationship: NewRelationship = {
		parentId: parent.id,
		childId: child.id,
		childTagName: child.tagName,
	}

	pendingChildrenRelationshipsPerParent[parent.tagName].push(newChildRelationship)
}

export function resolveCurrentBatchChildrenRelationships(params: {
	parentRecordsBatch: DatabaseRecord[]
	parentTagName: AvailableTagName
}): DatabaseRecord[] {
	const { parentRecordsBatch, parentTagName } = params
	const updatedParentRecordsBatch = [...parentRecordsBatch]

	const relationships = getPendingChildrenRelationshipsPerParent(parentTagName)

	for (const currentParentRecord of parentRecordsBatch) {
		const children = relationships
			.filter((relationship) => relationship.parentId === currentParentRecord.id)
			.map((relationship) => ({
				id: relationship.childId,
				tagName: relationship.childTagName,
			})) as Relationship[]

		if (children.length > 0) {
			const parentIndex = updatedParentRecordsBatch.findIndex(
				(record) => record.id === currentParentRecord.id
			)

			if (parentIndex >= 0) {
				if (!updatedParentRecordsBatch[parentIndex].children) {
					updatedParentRecordsBatch[parentIndex].children = []
				}
				updatedParentRecordsBatch[parentIndex].children.push(...children)

				removeProcessedChildrenRelationships({
					children,
					tagName: currentParentRecord.tagName,
				})
			}
		}
	}

	return updatedParentRecordsBatch
}

//====== PRIVATE FUNCTIONS ======//

function getPendingChildrenRelationshipsPerParent(
	parentTagName: AvailableTagName
): NewRelationship[] {
	return pendingChildrenRelationshipsPerParent[parentTagName] || []
}

function removeProcessedChildrenRelationships(params: {
	children: Relationship[]
	tagName: AvailableTagName
}): void {
	const { children, tagName } = params

	const processedChildrenIds = children.map((child) => child.id)
	const parentRelationships = getPendingChildrenRelationshipsPerParent(tagName)

	pendingChildrenRelationshipsPerParent[tagName] = parentRelationships.filter(
		(relationship) => !processedChildrenIds.includes(relationship.childId)
	)
}
