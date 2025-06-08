// frontend/cypress/support/component.js
// This file is used to add custom commands and utilities to the Cypress test runner.

import { BrowserRouter } from 'react-router-dom'

Cypress.Commands.add('mount', (component, options = {}) => {
  const wrapped = <BrowserRouter>{component}</BrowserRouter>
  return mount(wrapped, options)
})