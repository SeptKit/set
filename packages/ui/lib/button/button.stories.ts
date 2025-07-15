import type { Meta, StoryObj } from '@storybook/vue3-vite'

import Button from './button.vue'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
	title: 'Actions/Button',
	component: Button,
	// This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	argTypes: {
		// slots
		default: {
			control: 'text',
		},
		// props
		color: {
			control: { type: 'select', labels: { default: '' } },
			options: [
				'default',
				'neutral',
				'primary',
				'secondary',
				'accent',
				'info',
				'success',
				'warning',
				'error',
			],
		},
		variant: {
			control: { type: 'select', labels: { default: '' } },
			options: ['default', 'outline', 'dash', 'soft', 'ghost', 'link'],
		},
		size: {
			control: { type: 'select', labels: { default: '' } },
			options: ['default', 'xs', 'sm', 'md', 'lg', 'xl'],
		},
		active: { control: 'boolean' },
		disabled: { control: 'boolean' },
		modifier: {
			control: { type: 'select', labels: { default: '' } },
			options: ['default', 'wide', 'block', 'square', 'circle'],
		},
	},
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		default: 'Click me',
	},
	render: (args) => ({
		components: { Button },
		setup() {
			return { args }
		},
		template: `
			<Button v-bind="args">
				{{ args.default }}
			</Button>
		`,
	}),
}
