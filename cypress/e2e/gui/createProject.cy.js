import { faker } from '@faker-js/faker'

describe('Create Project', () => {

    const project = {
        name: `project-${faker.datatype.uuid()}`,
        description: faker.random.words(5)
    }

    beforeEach(() => {
        cy.api_deleteProjects()
        cy.login()
    })

    it('successfully', () => {
        cy.gui_createProject(project)

        cy.url().should('be.equal', `${Cypress.config('baseUrl')}/${Cypress.env('user_name')}/${project.name}`)
        cy.get('.home-panel-title.qa-project-name').contains(project.name).should('be.visible')
        cy.get('.home-panel-description-markdown.read-more-container').contains(project.description).should('be.visible')
    })
})
