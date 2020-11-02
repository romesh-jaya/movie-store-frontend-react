/// <reference types="cypress" />

describe('Auth Test', () => {
  beforeEach(function () {});

  it('should redirect unauthenticated user to login page', function () {
    cy.visit('/');
    cy.location('pathname').should('equal', '/login');
  });

  it('should login and logout successfully', function () {
    cy.login(Cypress.env('TESTUSERNAME'), Cypress.env('TESTPASSWORD'));
    cy.logout();
  });

  it('should login and search for a movie successfully', function () {
    cy.login(Cypress.env('TESTUSERNAME'), Cypress.env('TESTPASSWORD'));
    cy.get('#search-button').click();
    cy.get('.MuiTableRow-root').should('exist');
    cy.logout();
  });
});
