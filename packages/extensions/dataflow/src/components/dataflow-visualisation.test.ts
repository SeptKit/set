import { expect, describe, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import DataflowVisualisation from './dataflow-visualisation.vue'
import { type LNode } from '../types/lnode'

// Mock the DB so the component does not try to actually open or access a database
vi.mock('../assets/use-lnode-records', () => {
	const sendingLNode: LNode = {
		id: '1',
		uuid: 'dc91b40a-d48d-4218-bfa5-8dfaf66c7a59',
		iedName: 'PIU',
		lnType: 'tctr_7_4_B2007',
		prefix: 'I01A',
		lnClass: 'TCTR',
		lnInst: '11',
		dataObjects: [],
		dataObjectSpecifications: [],
	}

	const receivingLNode: LNode = {
		id: '2',
		uuid: '80dee19b-e263-4904-a54e-6191183a9877',
		iedName: 'P1',
		lnType: 'ELIA_PTRC_TR_SET_V002',
		prefix: '',
		lnClass: 'PTRC',
		lnInst: '1',
		dataObjects: [],
		dataObjectSpecifications: [],
	}

	return {
		getEnrichedLNodesFromDB: vi.fn().mockResolvedValue([sendingLNode, receivingLNode]),
	}
})

describe('DataflowVisualisation', () => {
	describe('Dataflow Creation', () => {
		it('should disable create connection button if sending and receiving lnodes are not selected', async () => {
			const screen = render(DataflowVisualisation)

			await expect.element(screen.getByText('+', { exact: true })).toBeDisabled()

			const inputLNodeSelect = screen.getByTestId('select-input-lnode')

			await expect.element(inputLNodeSelect).toBeInTheDocument()

			// Only selecting input lnode should not enable the button either
			await inputLNodeSelect.selectOptions('I01A TCTR 11')
			expect(inputLNodeSelect).toHaveValue('1')

			await expect.element(screen.getByText('+', { exact: true })).toBeDisabled()
		})
		it('enables create connection button when both sending and receiving lnodes are selected', async () => {
			const screen = render(DataflowVisualisation)

			const inputLNodeSelect = screen.getByTestId('select-input-lnode')
			const outputLNodeSelect = screen.getByTestId('select-output-lnode')

			await expect.element(inputLNodeSelect).toBeInTheDocument()
			await expect.element(outputLNodeSelect).toBeInTheDocument()

			await inputLNodeSelect.selectOptions('I01A TCTR 11')
			expect(inputLNodeSelect).toHaveValue('1')

			await outputLNodeSelect.selectOptions('PTRC 1')
			expect(outputLNodeSelect).toHaveValue('2')

			await expect.element(screen.getByText('+', { exact: true })).toBeEnabled()
		})
		it('opens dataflow creation dialog when create connection button is clicked', async () => {
			const screen = render(DataflowVisualisation)

			const inputLNodeSelect = screen.getByTestId('select-input-lnode')
			const outputLNodeSelect = screen.getByTestId('select-output-lnode')

			await expect.element(inputLNodeSelect).toBeInTheDocument()
			await expect.element(outputLNodeSelect).toBeInTheDocument()

			await inputLNodeSelect.selectOptions('I01A TCTR 11')
			expect(inputLNodeSelect).toHaveValue('1')

			await outputLNodeSelect.selectOptions('PTRC 1')
			expect(outputLNodeSelect).toHaveValue('2')

			const plusButton = screen.getByText('+', { exact: true })
			await plusButton.click()

			await expect.element(screen.getByText('Create Connection', { exact: true })).toBeVisible()
		})
		it('closes dataflow creation dialog when close button is clicked', async () => {
			const screen = render(DataflowVisualisation)

			const inputLNodeSelect = screen.getByTestId('select-input-lnode')
			const outputLNodeSelect = screen.getByTestId('select-output-lnode')

			await expect.element(inputLNodeSelect).toBeInTheDocument()
			await expect.element(outputLNodeSelect).toBeInTheDocument()

			await inputLNodeSelect.selectOptions('I01A TCTR 11')
			expect(inputLNodeSelect).toHaveValue('1')

			await outputLNodeSelect.selectOptions('PTRC 1')
			expect(outputLNodeSelect).toHaveValue('2')

			await screen.getByText('+', { exact: true }).click()

			await expect.element(screen.getByText('Create Connection', { exact: true })).toBeVisible()

			await screen.getByText('Close', { exact: true }).click()

			await expect.element(screen.getByText('Create Connection', { exact: true })).not.toBeVisible()
		})
	})
})
