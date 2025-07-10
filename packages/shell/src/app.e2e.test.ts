import { render } from 'vitest-browser-vue'
import { expect, test } from 'vitest'
import app from './app.vue'

test('renders the headline "SET"', async () => {
  const screen = render(app)

  await expect.element(screen.getByText('SET')).toBeVisible()
})

/**************/

// import { describe, it, expect } from 'vitest'
// import { mount } from '@vue/test-utils'
// import app from './app.vue'

// describe('app.vue', () => {
//   it('renders the headline "SET"', () => {
//     const wrapper = mount(app)

//     expect(wrapper.text()).toContain('SET')
//   })
// })

/**************/

// import { render, screen, cleanup } from '@testing-library/vue'
// import { describe, it, afterEach, expect } from 'vitest'
// import app from './app.vue'

// afterEach(() => {
//   cleanup() // räumt DOM nach jedem Test auf
// })

// describe('app.vue', () => {
//   it('renders the headline "SET"', () => {
//     // render(app)
//     // expect(screen.getByText('SET')).toBeTruthy()

//     const root = document.createElement('div')
//     root.id = 'test-root'
//     document.body.appendChild(root)
//     render(app, { container: root })
//     expect(screen.getByText('SET')).toBeTruthy()
//   })
// })
