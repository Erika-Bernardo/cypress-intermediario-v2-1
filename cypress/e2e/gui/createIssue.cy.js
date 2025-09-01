import { faker } from '@faker-js/faker'

describe('Create Issue', () => {
    const issue = {
        title: `issue-${faker.datatype.uuid()}`,
        description: faker.random.words(3),
        project: {
            name: `project-${faker.datatype.uuid()}`,
            description: faker.random.words(5)
        }
    }

    beforeEach(() => {
        cy.api_deleteProjects()
        cy.login()
        cy.gui_createProject(issue.project)
    })

    it('successfully', () => {
        cy.gui_createIssue(issue)

        cy.get('.issue-details').within(() => {
            cy.get('.title.qa-title').should('be.visible').and('contain', issue.title)
            cy.get('.description.js-task-list-container.is-task-list-enabled').should('be.visible').and('contain', issue.description)
        })
    })
})