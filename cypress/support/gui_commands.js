// ***********************************************
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('login', (
    user = Cypress.env('user_name'),
    password = Cypress.env('user_password'),
    { cacheSession = true } = {},
) => {
    const login = () => {
        cy.visit('/users/sign_in')

        cy.get('#user_login').type(user)
        cy.get('#user_password').type(password, { log: false })
        cy.get("[data-qa-selector='sign_in_button']").click()
    }

    const validate = () => {
        cy.visit('/')
        cy.location('pathname', { timeout: 1000 }).should('not.eq', '/users/sign_in')
    }

    const options = {
        cacheAcrossSpecs: true,
        validate,
    }

    if (cacheSession) {
        cy.session(user, login, options)
        cy.visit('/')
    } else {
        login()
    }
})

Cypress.Commands.add('logout', () => {
    cy.get('.qa-user-avatar').click()
    cy.get('[data-qa-selector="sign_out_link"]').contains('Sign out').click()
})

Cypress.Commands.add('gui_createProject', project => {
    cy.get('body').then(($body) => {
        if ($body.find('.blank-state-welcome-title:visible').length > 0) {
            cy.get('.blank-state-welcome-title').contains('Welcome to GitLab').then(($paginaSemProjetos) => {
                if ($paginaSemProjetos.is(':visible')) {
                    cy.get('[href="/projects/new"] > .blank-state-body').contains('Create a project').should('be.visible').click()
                }
            })
        } else if ($body.find('.shortcuts-activity').length > 0) {
            cy.get('a.btn.btn-success').contains('New project').should('be.visible').click()
        }
    });

    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/projects/new`)
    // Alternativamente, vc pode navegar diretamente pela URL
    // cy.visit('/projects/new')

    cy.get('#project_name').type(project.name)
    cy.get('#project_description').type(project.description)
    cy.get('.qa-initialize-with-readme-checkbox').check()
    cy.get('.btn.btn-success.project-submit:visible').contains('Create project').click()
})

Cypress.Commands.add('gui_createIssue', issue => {
    cy.get('.shortcuts-issues').should('be.visible').click()
    cy.get('#new_issue_link').contains('New issue').should('be.visible').click()
    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/${Cypress.env('user_name')}/${issue.project.name}/issues/new`)

    // Alternativamente, vc pode navegar diretamente pela URL
    // cy.visit(`/${Cypress.env('user_name')}/${issue.project.name}/issues/new`)

    cy.get('#issue_title').type(issue.title)
    cy.get('#issue_description').type(issue.description)
    cy.get('.btn.btn-success.qa-issuable-create-button').contains('Submit issue').click()
})