import { render } from 'vitest-browser-vue'
import { expect, test } from 'vitest'
import app from './app.vue'

test('renders the headline "SET"', async () => {
  const screen = render(app)

  await expect.element(screen.getByText('SET')).toBeVisible()
})

/******* keine UI Preview in Playwright *******/

// import { describe, it, expect } from 'vitest'
// import { mount } from '@vue/test-utils'
// import app from './app.vue'

// describe('app.vue', () => {
//   it('renders the headline "SET"', () => {
//     const wrapper = mount(app)

//     expect(wrapper.text()).toContain('SET')
//   })
// })

/******* UI Preview in Playwright *******/

// import { render, screen, cleanup } from '@testing-library/vue'
// import { describe, it, afterEach, expect } from 'vitest'
// import app from './app.vue'

// // afterEach(() => {
// //   cleanup() // räumt DOM nach jedem Test auf, müsste mit time-out erfolgen, für sichtbare UI preview
// // })

// describe('app.vue', () => {
//   it('renders the headline "SET"', () => {
//     const root = document.createElement('div')
//     root.id = 'test-root'
//     document.body.appendChild(root)
//     render(app, { container: root })
//     expect(screen.getByText('SET')).toBeTruthy()
//   })
// })
