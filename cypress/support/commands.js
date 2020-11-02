// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
  const log = Cypress.log({
    name: 'login',
    displayName: 'LOGIN',
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  });
  // Use the login-admin page as it is username-pwd based auth
  cy.visit('/login-admin');
  cy.get('#login-button').click(); // at this point it should redirect to the auth0 endpoint
  cy.url().should('contain', 'auth0.com');
  cy.get('#1-email').type(username);
  cy.get('.auth0-lock-input-show-password input').type(password);
  cy.get('.auth0-lock-submit').click(); // at this point it should redirect back to the app
  cy.location('pathname').should('equal', '/');
  log.end();
});

Cypress.Commands.add('logout', () => {
  const log = Cypress.log({
    name: 'logout',
    displayName: 'LOGOUT',
    message: [`🔐 Logging out session`],
    // @ts-ignore
    autoEnd: false,
  });
  cy.get('#logout-button').click();
  cy.location('pathname').should('equal', '/login');
  log.end();
});
