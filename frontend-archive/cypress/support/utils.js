// cypress/support/utils.js

export const login = () => {
    cy.visit('/signin');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('qwerqwer*');
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', 'http://localhost:8080/');
  };