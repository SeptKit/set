import { expect, describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import DataflowVisualisation from './dataflow-visualisation.vue'
import type { LNodeSDK } from './use-lnodes'
import type { LNode } from './lnode'

const mockLNodes: LNode[] = [
	{
		id: '1',
		uuid: 'uuid-1',
		iedName: 'IED1',
		lnType: 'LT1',
		prefix: 'P',
		lnClass: 'XCBR',
		lnInst: '1',
		dataObjects: [
			{
				id: 'do1',
				uuid: 'uuid-do1',
				name: 'Beh',
				dataAttributes: [
					{ id: 'da1', uuid: 'uuid-da1', name: 'stVal', dataObjectId: 'do1', fc: 'ST' },
					{ id: 'da2', uuid: 'uuid-da2', name: 'q', dataObjectId: 'do1', fc: 'ST' },
				],
				lNodeId: '1',
			},
			{
				id: 'do2',
				uuid: 'uuid-do2',
				name: 'Pos',
				dataAttributes: [
					{ id: 'da3', uuid: 'uuid-da3', name: 'ctlVal', dataObjectId: 'do2', fc: 'CO' },
				],
				lNodeId: '1',
			},
		],
		dataObjectSpecifications: [
			{
				id: 'dos1',
				name: 'MySpec1',
				desc: 'Desc1',
				dataAttributeSpecification: [
					{ id: 'das1', name: 'SpecAttr1', desc: 'test', dataObjectSpecificationId: 'dos1' },
				],
				lNodeId: '1',
			},
		],
	},
	{
		id: '2',
		uuid: 'uuid-2',
		iedName: 'IED2',
		lnType: 'LT2',
		prefix: 'Q',
		lnClass: 'PTRC',
		lnInst: '2',
		dataObjects: [
			{
				id: 'do3',
				uuid: 'uuid-do3',
				name: 'OpCnt',
				dataAttributes: [
					{ id: 'da4', uuid: 'uuid-da4', name: 'opVal', dataObjectId: 'do3', fc: 'CO' },
				],
				lNodeId: '2',
			},
		],
		dataObjectSpecifications: [
			{
				id: 'dos2',
				name: 'MySpec2',
				desc: 'Desc2',
				dataAttributeSpecification: [
					{ id: 'das2', name: 'SpecAttr2', desc: 'test', dataObjectSpecificationId: 'dos2' },
				],
				lNodeId: '2',
			},
		],
	},
]

describe('DataflowVisualisation', () => {
	it('renders two visualised nodes with the select LNode placeholder', async () => {
		// Arrange
		const { container } = render(DataflowVisualisation, {
			props: {
				lnodeSDK: createLNodeSDKMock(),
			},
		})

		// Act: Find all dropdown/select placeholder texts
		const selectLNodeCount = (container.textContent?.match(/Select LNode/g) || []).length

		// Assert:  that there are two visual nodes with the placeholder
		expect(selectLNodeCount).toBe(2)
	})
	describe('Dataflow Creation', () => {
		it('should disable create connection button if sending and receiving lnodes are not selected', async () => {
			const screen = render(DataflowVisualisation, {
				props: {
					lnodeSDK: createLNodeSDKMock(),
				},
			})

			await expect.element(screen.getByText('+', { exact: true })).toBeDisabled()

			const inputLNodeSelect = screen.getByTestId('select-input-lnode')

			await expect.element(inputLNodeSelect).toBeInTheDocument()

			// Only selecting input lnode should not enable the button either
			await inputLNodeSelect.selectOptions('P XCBR 1')
			expect(inputLNodeSelect).toHaveValue('1')

			await expect.element(screen.getByText('+', { exact: true })).toBeDisabled()
		})
		it('enables create connection button when both sending and receiving lnodes are selected', async () => {
			const screen = render(DataflowVisualisation, {
				props: {
					lnodeSDK: createLNodeSDKMock(),
				},
			})

			const inputLNodeSelect = screen.getByTestId('select-input-lnode')
			const outputLNodeSelect = screen.getByTestId('select-output-lnode')

			await expect.element(inputLNodeSelect).toBeInTheDocument()
			await expect.element(outputLNodeSelect).toBeInTheDocument()

			await inputLNodeSelect.selectOptions('P XCBR 1')
			expect(inputLNodeSelect).toHaveValue('1')

			await outputLNodeSelect.selectOptions('Q PTRC 2')
			expect(outputLNodeSelect).toHaveValue('2')

			await expect.element(screen.getByText('+', { exact: true })).toBeEnabled()
		})
		it('opens dataflow creation dialog when create connection button is clicked', async () => {
			const screen = render(DataflowVisualisation, {
				props: {
					lnodeSDK: createLNodeSDKMock(),
				},
			})

			const inputLNodeSelect = screen.getByTestId('select-input-lnode')
			const outputLNodeSelect = screen.getByTestId('select-output-lnode')

			await expect.element(inputLNodeSelect).toBeInTheDocument()
			await expect.element(outputLNodeSelect).toBeInTheDocument()

			await inputLNodeSelect.selectOptions('P XCBR 1')
			await outputLNodeSelect.selectOptions('Q PTRC 2')

			const plusButton = screen.getByText('+', { exact: true })
			await plusButton.click()

			await expect.element(screen.getByText('Create Connection', { exact: true })).toBeVisible()
		})
		it('closes dataflow creation dialog when close button is clicked', async () => {
			const screen = render(DataflowVisualisation, {
				props: {
					lnodeSDK: createLNodeSDKMock(),
				},
			})

			const inputLNodeSelect = screen.getByTestId('select-input-lnode')
			const outputLNodeSelect = screen.getByTestId('select-output-lnode')

			await expect.element(inputLNodeSelect).toBeInTheDocument()
			await expect.element(outputLNodeSelect).toBeInTheDocument()

			await inputLNodeSelect.selectOptions('P XCBR 1')
			await outputLNodeSelect.selectOptions('Q PTRC 2')

			await screen.getByText('+', { exact: true }).click()

			await expect.element(screen.getByText('Create Connection', { exact: true })).toBeVisible()

			await screen.getByText('Close', { exact: true }).click()

			await expect.element(screen.getByText('Create Connection', { exact: true })).not.toBeVisible()
		})
	})
})

function createLNodeSDKMock(): LNodeSDK {
	return {
		findAllEnrichedFromDB: () => {
			return Promise.resolve(mockLNodes)
		},
		enrichWithDataObjects: (lnodes) => {
			return Promise.resolve(lnodes)
		},
		enrichWithDataAttributes: (lnodes) => {
			return Promise.resolve(lnodes)
		},
		enrichWithDataObjectSpecifications: (lnodes) => {
			return Promise.resolve(lnodes)
		},
		close: () => {},
	}
}
