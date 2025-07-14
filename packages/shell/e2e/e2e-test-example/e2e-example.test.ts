import { render, screen } from '@testing-library/vue'
import { it, expect } from 'vitest'
import { defineComponent } from 'vue'

it('renders headline', async () => {
  // simulate a simple Vue component
  const ExampleComponent = defineComponent({
    template: '<h1>E2E Test</h1>',
  })

  render(ExampleComponent)
  expect(screen.getByText('E2E Test')).toBeTruthy()
})
