// cypress/e2e/message_detail_send_form_validation.cy.js

import { login } from '../support/utils';

describe('Message Detail Send Form Validation', () => {
  it('Validates message send form', () => {
    login();

    cy.visit('/messages/1');

    // Test: Empty submission
    cy.get('button:contains("Send")').click();
    cy.get('.alert-warning').should('contain', 'Please enter a message or upload an image');

    // Test: Message too long
    cy.get('textarea[name="content"]').type('a'.repeat(1001));
    cy.get('button:contains("Send")').click();
    cy.get('.alert-warning').should('contain', 'Message should not exceed 1000 characters');

    // Test: Message with only spaces
    cy.get('textarea[name="content"]').clear().type('   ');
    cy.get('button:contains("Send")').click();
    cy.get('.alert-warning').should('contain', 'Please enter a message or upload an image');

    // Test: Image file too large
    cy.get('input[type="file"]').attachFile('large-image.jpg');
    cy.get('.alert-warning').should('contain', 'Image file size should not exceed 5MB');

    // Test: Invalid image type
    cy.get('input[type="file"]').attachFile('test-file.txt');
    cy.get('.alert-warning').should('contain', 'Only JPEG, PNG, and GIF images are allowed');

    // Test: Valid image with no message
    cy.get('textarea[name="content"]').clear();
    cy.get('input[type="file"]').attachFile('test-image.jpg');
    cy.get('button:contains("Send")').click();
    cy.get('.alert-warning').should('not.exist');

    // Test: Valid message with no image
    cy.get('textarea[name="content"]').clear().type('Hello, world!');
    cy.get('button:contains("Send")').click();
    cy.get('.alert-warning').should('not.exist');
  });
});