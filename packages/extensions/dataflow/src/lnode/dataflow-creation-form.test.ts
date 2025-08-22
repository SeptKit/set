import { expect, describe, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import DataflowCreationForm from './dataflow-creation-form.vue'
import { getLNodeLabel, type LNode } from './lnode'

const createDataflowMock = vi.fn()

vi.mock('@/lnode/use-dataflow.ts', () => ({
	useDataflow: () => ({
		create: createDataflowMock,
	}),
}))

vi.mock('@/x/database.ts', () => {
	return {
		openDatabase: () => {},
	}
})

const sendingLNode: LNode = {
	id: '1',
	uuid: 'dc91b40a-d48d-4218-bfa5-8dfaf66c7a59',
	iedName: 'PIU',
	lnType: 'tctr_7_4_B2007',
	prefix: 'I01A',
	lnClass: 'TCTR',
	lnInst: '11',
	dataObjects: [
		{
			id: '1',
			uuid: 'c1b2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
			name: 'Op',
			dataAttributes: [
				{
					id: '1',
					uuid: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
					name: 'general',
					dataObjectId: 'c1b2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
					fc: 'ST',
				},
				{
					id: '2',
					uuid: 'd1e2f3a4-b5c6-7d8e-9f0a-b1c2d3e4f5a6',
					name: 'q',
					dataObjectId: 'c1b2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
					fc: 'ST',
				},
				{
					id: '3',
					uuid: 's1a2b3c4-d5e6-7f8g-9h0i-j1k2l3m4n5o6',
					name: 't',
					dataObjectId: 'c1b2d3e4-f5a6-7b8c-9d0e-f1a2b3c4d5e6',
					fc: 'ST',
				},
			],
			lNodeId: '1',
		},
		{
			id: '2',
			uuid: 'f2b3c4d5-e6a7-8b9c-0d1e-f2a3b4c5d6e7',
			name: 'MinPlsDur',
			dataAttributes: [
				{
					id: '1',
					uuid: 'g1h2i3j4-k5l6-7m8n-9o0p-q1r2s3t4u5v6',
					name: 'setVal',
					dataObjectId: 'f2b3c4d5-e6a7-8b9c-0d1e-f2a3b4c5d6e7',
					fc: 'SP',
				},
				{
					id: '2',
					uuid: 'h1i2j3k4-l5m6-7n8o-9p0q-r1s2t3u4v5w6',
					name: 'd',
					dataObjectId: 'f2b3c4d5-e6a7-8b9c-0d1e-f2a3b4c5d6e7',
					fc: 'DC',
				},
			],
			lNodeId: '2',
		},
	],
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

describe('DataflowCreationForm', () => {
	describe('Render elements', () => {
		it('renders form elements ', async () => {
			const screen = render(DataflowCreationForm, {
				props: {
					sourceLNode: sendingLNode,
					destinationLNode: receivingLNode,
					isOpen: true,
				},
			})
			// Title
			await expect
				.element(screen.getByText('Create Connection', { exact: true }))
				.toBeInTheDocument()
			// Buttons
			await expect
				.element(screen.getByRole('button', { name: 'Close', exact: true }))
				.toBeInTheDocument()
			await expect
				.element(screen.getByRole('button', { name: 'Save', exact: true }))
				.toBeInTheDocument()
			// Input Labels
			await expect.element(screen.getByText('Dataflow Type', { exact: true })).toBeInTheDocument()
			await expect.element(screen.getByText('Source', { exact: true })).toBeInTheDocument()
			await expect.element(screen.getByText('Signal (DO)', { exact: true })).toBeInTheDocument()
			await expect.element(screen.getByText('Attribute (DA)', { exact: true })).toBeInTheDocument()
			await expect.element(screen.getByText('Destination', { exact: true })).toBeInTheDocument()
			await expect
				.element(screen.getByText('Destination Input Name', { exact: true }))
				.toBeInTheDocument()
			await expect.element(screen.getByText('Input Instance', { exact: true })).toBeInTheDocument()
			await expect.element(screen.getByText('Include Quality', { exact: true })).toBeInTheDocument()
			await expect
				.element(screen.getByText('Include Timestamp', { exact: true }))
				.toBeInTheDocument()
		})
		it('renders source and destination lnode label', async () => {
			const screen = render(DataflowCreationForm, {
				props: {
					sourceLNode: sendingLNode,
					destinationLNode: receivingLNode,
					isOpen: true,
				},
			})
			await expect
				.element(screen.getByText(getLNodeLabel(sendingLNode), { exact: true }))
				.toBeInTheDocument()
			await expect
				.element(screen.getByText(getLNodeLabel(receivingLNode), { exact: true }))
				.toBeInTheDocument()
		})
	})
	describe('Form actions', () => {
		it('shows alert when mandatory field is not filled', async () => {
			const screen = render(DataflowCreationForm, {
				props: {
					sourceLNode: sendingLNode,
					destinationLNode: receivingLNode,
					isOpen: true,
				},
			})
			vi.spyOn(window, 'alert')
			// Click save button without filling mandatory fields
			const saveButton = screen.getByRole('button', { name: 'Save', exact: true })
			await expect.element(saveButton).toBeEnabled()
			await saveButton.click()
			expect(alert).toHaveBeenCalledWith('Please select a dataflow type.')
		})
		it('calls create dataflow function when save button is clicked', async () => {
			localStorage.setItem('currentActiveFileDatabaseName', 'testfile')

			const screen = render(DataflowCreationForm, {
				props: {
					sourceLNode: sendingLNode,
					destinationLNode: receivingLNode,
					isOpen: true,
				},
			})
			await screen.getByTestId('select-dataflow-type').selectOptions('GOOSE', { exact: true })
			await screen.getByTestId('select-data-object').selectOptions('Op', { exact: true })
			await screen.getByTestId('select-data-attribute').selectOptions('general', { exact: true })
			const saveButton = screen.getByRole('button', { name: 'Save', exact: true })
			await expect.element(saveButton).toBeEnabled()
			await saveButton.click()
			expect(createDataflowMock).toHaveBeenCalledWith(
				{
					type: 'GOOSE',
					signal: 'Op',
					attribute: 'general',
					inputName: 'Op', // currently prefilled with signal name
					inputInstance: '1', // currently hardcoded in the form
					includeQuality: true,
					includeTimestamp: false,
				},
				sendingLNode,
				receivingLNode,
			)
		})
	})
	describe('Form fields', () => {
		it('clears form fields which are dependent on dataflow type', async () => {
			const screen = render(DataflowCreationForm, {
				props: {
					sourceLNode: sendingLNode,
					destinationLNode: receivingLNode,
					isOpen: true,
				},
			})
			const dataflowTypeSelect = screen.getByTestId('select-dataflow-type')
			await expect.element(dataflowTypeSelect).toBeInTheDocument()
			await dataflowTypeSelect.selectOptions('GOOSE', { exact: true })
			await expect.element(dataflowTypeSelect).toHaveValue('GOOSE')
			const dataObjectSelect = screen.getByTestId('select-data-object')
			await expect.element(dataObjectSelect).toBeInTheDocument()
			await dataObjectSelect.selectOptions('Op', { exact: true })
			await expect.element(dataObjectSelect).toHaveValue('Op')
			// Change dataflow type to SMV to trigger clearing of data object select
			await dataflowTypeSelect.selectOptions('SMV', { exact: true })
			await expect.element(dataObjectSelect).toHaveValue('')
		})
		it('clears form fields which are dependent on signal', async () => {
			const screen = render(DataflowCreationForm, {
				props: {
					sourceLNode: sendingLNode,
					destinationLNode: receivingLNode,
					isOpen: true,
				},
			})
			const dataflowTypeSelect = screen.getByTestId('select-dataflow-type')
			await expect.element(dataflowTypeSelect).toBeInTheDocument()
			await dataflowTypeSelect.selectOptions('GOOSE', { exact: true })
			await expect.element(dataflowTypeSelect).toHaveValue('GOOSE')
			const dataObjectSelect = screen.getByTestId('select-data-object')
			await expect.element(dataObjectSelect).toBeInTheDocument()
			await dataObjectSelect.selectOptions('Op', { exact: true })
			const dataAttributeSelect = screen.getByTestId('select-data-attribute')
			await expect.element(dataAttributeSelect).toBeInTheDocument()
			await dataAttributeSelect.selectOptions('general', { exact: true })
			await expect.element(dataAttributeSelect).toHaveValue('general')
			// Change data object to 'MinPlsDur' to trigger clearing of data attribute select
			await dataObjectSelect.selectOptions('MinPlsDur', { exact: true })
			await expect.element(dataAttributeSelect).toHaveValue('')
		})
		it('preselects checkboxes depending on selected dataflow type', async () => {
			const screen = render(DataflowCreationForm, {
				props: {
					sourceLNode: sendingLNode,
					destinationLNode: receivingLNode,
					isOpen: true,
				},
			})
			const dataflowTypeSelect = screen.getByTestId('select-dataflow-type')
			await expect.element(dataflowTypeSelect).toBeInTheDocument()
			await dataflowTypeSelect.selectOptions('GOOSE', { exact: true })
			await expect.element(screen.getByTestId('checkbox-include-quality')).toBeChecked()
			await expect.element(screen.getByTestId('checkbox-include-timestamp')).not.toBeChecked()
			await dataflowTypeSelect.selectOptions('SMV', { exact: true })
			await expect.element(screen.getByTestId('checkbox-include-quality')).toBeChecked()
			await expect.element(screen.getByTestId('checkbox-include-timestamp')).not.toBeChecked()
			await dataflowTypeSelect.selectOptions('Report', { exact: true })
			await expect.element(screen.getByTestId('checkbox-include-quality')).toBeChecked()
			await expect.element(screen.getByTestId('checkbox-include-timestamp')).toBeChecked()
			await dataflowTypeSelect.selectOptions('Internal', { exact: true })
			await expect.element(screen.getByTestId('checkbox-include-quality')).not.toBeChecked()
			await expect.element(screen.getByTestId('checkbox-include-timestamp')).not.toBeChecked()
			await dataflowTypeSelect.selectOptions('Wired', { exact: true })
			await expect.element(screen.getByTestId('checkbox-include-quality')).not.toBeChecked()
			await expect.element(screen.getByTestId('checkbox-include-timestamp')).not.toBeChecked()
			await dataflowTypeSelect.selectOptions('Control', { exact: true })
			await expect.element(screen.getByTestId('checkbox-include-quality')).not.toBeChecked()
			await expect.element(screen.getByTestId('checkbox-include-timestamp')).not.toBeChecked()
		})
		it('shows correct signal select options', async () => {
			const screen = render(DataflowCreationForm, {
				props: {
					sourceLNode: sendingLNode,
					destinationLNode: receivingLNode,
					isOpen: true,
				},
			})
			const dataflowTypeSelect = screen.getByTestId('select-dataflow-type')
			await expect.element(dataflowTypeSelect).toBeInTheDocument()
			await dataflowTypeSelect.selectOptions('GOOSE', { exact: true })
			await expect.element(screen.getByText('Op', { exact: true })).toBeInTheDocument()
			await expect.element(screen.getByText('MinPlsDur', { exact: true })).toBeInTheDocument()
			// SMV data type has only mapping for 'Op' via DataflowTypeToFCMap
			await dataflowTypeSelect.selectOptions('SMV', { exact: true })
			await expect.element(screen.getByText('Op', { exact: true })).toBeInTheDocument()
			await expect.element(screen.getByText('MinPlsDur', { exact: true })).not.toBeInTheDocument()
			await dataflowTypeSelect.selectOptions('Report', { exact: true })
			await expect.element(screen.getByText('Op', { exact: true })).toBeInTheDocument()
			await expect.element(screen.getByText('MinPlsDur', { exact: true })).toBeInTheDocument()
			// Control data type currently has no mapping to data objects via DataflowTypeToFCMap
			await dataflowTypeSelect.selectOptions('Control', { exact: true })
			await expect.element(screen.getByText('Op', { exact: true })).not.toBeInTheDocument()
			await expect.element(screen.getByText('MinPlsDur', { exact: true })).not.toBeInTheDocument()
		})
		it('shows correct data attribute select options', async () => {
			const screen = render(DataflowCreationForm, {
				props: {
					sourceLNode: sendingLNode,
					destinationLNode: receivingLNode,
					isOpen: true,
				},
			})
			const dataflowTypeSelect = screen.getByTestId('select-dataflow-type')
			await expect.element(dataflowTypeSelect).toBeInTheDocument()
			await dataflowTypeSelect.selectOptions('GOOSE', { exact: true })
			const dataObjectSelect = screen.getByTestId('select-data-object')
			await expect.element(dataObjectSelect).toBeInTheDocument()
			await dataObjectSelect.selectOptions('Op', { exact: true })
			await expect.element(screen.getByText('general', { exact: true })).toBeInTheDocument()
			// 'q' and 't' should be filtered out for data attributes
			await expect.element(screen.getByText('q', { exact: true })).not.toBeInTheDocument()
			await expect.element(screen.getByText('t', { exact: true })).not.toBeInTheDocument()
			await dataObjectSelect.selectOptions('MinPlsDur', { exact: true })
			await expect.element(screen.getByText('setVal', { exact: true })).toBeInTheDocument()
			// 'd' should be filtered out because of the FC value 'DC' for GOOSE dataflow type
			await expect.element(screen.getByText('d', { exact: true })).not.toBeInTheDocument()
		})
	})
})
