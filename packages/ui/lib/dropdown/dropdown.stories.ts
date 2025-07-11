import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect } from 'storybook/test'
// COMPONENTS
import Dropdown from './dropdown.vue'


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
	title: 'Actions/Dropdown',
	component: Dropdown,
	parameters: {
		// Set the height of the story canvas
		layout: 'padded',
	},
	// This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	argTypes: {
		// slots
		label: {
			control: 'text'
		},
		items: {
			control: 'text'
		},
		// props
		color: { control: { type: 'select', labels: { default: '' } }, options: ['default', 'neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'] },
		variant: { control: { type: 'select', labels: { default: '' } }, options: ['default', 'outline', 'dash', 'soft', 'ghost', 'link'] },
		size: { control: { type: 'select', labels: { default: '' } }, options: ['default', 'xs', 'sm', 'md', 'lg', 'xl'] },
		active: { control: 'boolean' },
		disabled: { control: 'boolean' },
		modifier: { control: { type: 'select', labels: { default: '' } }, options: ['default', 'wide', 'block', 'square', 'circle'] }
	},
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Click me',
		items: `
			<li><a href="#">Item 1</a></li>
			<li><a href="#">Item 2</a></li>
		`
	},
	render: (args) => ({
		components: { Dropdown },
		setup() {
			return { args }
		},
		template: `
			<Dropdown v-bind="args">
				<template #label>{{ args.label }}</template>
				<template #items>
					<div v-html="args.items"></div>
				</template>
			</Dropdown>
		`
	}),
	play: async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByTestId('dropdown-trigger'));

		await expect(
			canvas.getByTestId('dropdown-wrapper')
		).toHaveAttribute('open', '')
	},
};
