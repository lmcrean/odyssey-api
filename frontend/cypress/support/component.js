import { BrowserRouter } from 'react-router-dom'

Cypress.Commands.add('mount', (component, options = {}) => {
  const wrapped = <BrowserRouter>{component}</BrowserRouter>
  return mount(wrapped, options)
})