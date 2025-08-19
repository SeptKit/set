import { describe, it, expect, beforeEach } from 'vitest'
import Dexie from 'dexie'
import type { DatabaseRecord } from '../../node_modules/@septkit/fileio/dist/common/common.types'
import {
	enrichLNodesWithDataObjectSpecifications,
	enrichLNodesWithDataObjects,
	enrichLNodesWithDataAttributes,
} from '../assets/use-lnode-records'
import type { LNode } from '@/types/lnode'

describe('use-lnode-records helpers', () => {
	let db: Dexie

	beforeEach(async () => {
		// Set up a fresh in-memory DB for every test
		db = new Dexie('test-db')
		db.version(1).stores({
			LNode: 'id',
			LNodeType: 'id',
			DO: 'id',
			DOType: 'id',
			DA: 'id',
			Private: 'id',
			DOS: 'id',
		})
		await db.open()
	})

	it('enrichLNodesWithDataObjectSpecifications populates DataObjectSpecifications from Private/DOS', async () => {
		// Minimal LNode
		await db.table('LNode').add({
			id: 'l1',
			attributes: [{ name: 'uuid', value: 'l1uuid' }],
		} as DatabaseRecord)
		// Private child to LNode
		await db.table('Private').add({
			id: 'priv1',
			parent: { id: 'l1', tagName: 'LNode' },
			children: [{ id: 'dos1', tagName: 'DOS' }],
		} as DatabaseRecord)
		// DOS
		await db.table('DOS').add({
			id: 'dos1',
			attributes: [
				{ name: 'name', value: 'SpecName' },
				{ name: 'desc', value: 'SpecDesc' },
			],
		} as DatabaseRecord)
		const lnodes: LNode[] = [
			{
				id: 'l1',
				uuid: 'l1uuid',
				iedName: '',
				lnType: '',
				prefix: '',
				lnClass: '',
				lnInst: '',
				dataObjects: [],
			},
		]
		const result = await enrichLNodesWithDataObjectSpecifications(db, lnodes)
		expect(result[0].dataObjectSpecifications?.length).toBe(1)
		expect(result[0].dataObjectSpecifications?.[0].name).toBe('SpecName')
		expect(result[0].dataObjectSpecifications?.[0].desc).toBe('SpecDesc')
	})

	it('enrichLNodesWithDataObjects populates DataObjects from LNodeType/DO', async () => {
		// LNode with lnType 't1'
		await db.table('LNode').add({
			id: 'l2',
			attributes: [
				{ name: 'uuid', value: 'l2uuid' },
				{ name: 'lnType', value: 't1' },
			],
		} as DatabaseRecord)
		await db.table('LNodeType').add({
			id: 'typerec',
			attributes: [{ name: 'id', value: 't1' }],
			children: [{ id: 'do1', tagName: 'DO' }],
		} as DatabaseRecord)
		await db.table('DO').add({
			id: 'do1',
			attributes: [{ name: 'name', value: 'DOTest' }],
		} as DatabaseRecord)
		const lnodes: LNode[] = [
			{
				id: 'l2',
				uuid: 'l2uuid',
				iedName: '',
				lnType: 't1',
				prefix: '',
				lnClass: '',
				lnInst: '',
				dataObjects: [],
			},
		]
		const result = await enrichLNodesWithDataObjects(db, lnodes)
		expect(result[0].dataObjects.length).toBe(1)
		expect(result[0].dataObjects[0].name).toBe('DOTest')
	})

	it('enrichLNodesWithDataAttributes populates DataAttributes from DOType/DA', async () => {
		// LNode and DataObject setup
		await db.table('LNode').add({
			id: 'l3',
			attributes: [{ name: 'uuid', value: 'l3uuid' }],
		} as DatabaseRecord)
		await db.table('DO').add({
			id: 'do2',
			attributes: [{ name: 'type', value: 'dot1' }],
		} as DatabaseRecord)
		await db.table('DOType').add({
			id: 'dotyper',
			attributes: [{ name: 'id', value: 'dot1' }],
			children: [{ id: 'da1', tagName: 'DA' }],
		} as DatabaseRecord)
		await db.table('DA').add({
			id: 'da1',
			attributes: [
				{ name: 'name', value: 'DAName' },
				{ name: 'fc', value: 'ST' },
			],
		} as DatabaseRecord)
		// LNode with one DataObject (like after DO-enrichment)
		const lnodes: LNode[] = [
			{
				id: 'l3',
				uuid: 'l3uuid',
				iedName: '',
				lnType: '',
				prefix: '',
				lnClass: '',
				lnInst: '',
				dataObjects: [
					{
						id: 'do2',
						uuid: '',
						name: '',
						dataAttributes: [],
						lNodeId: 'l3',
					},
				],
			},
		]
		const result = await enrichLNodesWithDataAttributes(db, lnodes)
		expect(result[0].dataObjects[0].dataAttributes.length).toBe(1)
		expect(result[0].dataObjects[0].dataAttributes[0].name).toBe('DAName')
		expect(result[0].dataObjects[0].dataAttributes[0].fc).toBe('ST')
	})
})
