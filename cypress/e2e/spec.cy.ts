
describe('pokedex test spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    
    cy.get('#pokedex_search').type('pikachu')
    cy.get('#pikachu_evolution').should('be.visible').click().wait(500)
    cy.get('#close-modal').scrollIntoView().click()
    cy.get('#clear-search').click()
    cy.get('#pokedex_search').should('have.value', '')
    cy.scrollTo('bottom').wait(500)
    cy.get('#meowth').scrollIntoView()
    cy.get('#meowth_details').should('be.visible').click()
    cy.get('#meowth_image').should('be.visible')
    cy.get('#back-to-home').scrollIntoView().click()



  })
})