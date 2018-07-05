const faker = require('faker');

const generateFakeRecipe = () => ({
    imageUrl: 'fried-chicken.jpg',
    title: faker.lorem.sentence(),
    description: faker.lorem.sentences(3),
    timeToCook: faker.random.number(),
    ingredients: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()],
    procedure: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()]
});

describe('The recipe creation process', () => {

    it('should create a recipe for the user', () => {

        /// Arrange

        const fakeRecipe = generateFakeRecipe();

        // provide authenticated user

        cy.visit('http://localhost:4080');

        cy.get('[href="/auth/register"]').click();

        const fakeUser = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        cy.get('input[name="name"]').type(fakeUser.name);

        cy.get('input[name="email"]').type(fakeUser.email);

        cy.get('input[name="password"]').type(fakeUser.password);

        cy.get('input[name="confirmPassword"]').type(fakeUser.password);

        cy.get('.btn').click();

        /// Action

        cy.get('[data-testid=createRecipeHome]').click();

        // put in data into form

        cy.get('[data-testid=recipeTitle]').type(fakeRecipe.title);

        cy.get('[data-testid=timeToCook]').type(fakeRecipe.timeToCook);

        cy.get('[data-testid=recipeDescription]').type(fakeRecipe.description);

        cy.get('[data-testid=recipeIngredient-0]').type(fakeRecipe.ingredients[0]);

        cy.get(':nth-child(5) > .text-muted > .ion').click();

        cy.get('[data-testid=recipeIngredient-1]').type(fakeRecipe.ingredients[1]);

        cy.get(':nth-child(5) > .text-muted > .ion').click();


        cy.get('[data-testid=recipeIngredient-2]').type(fakeRecipe.ingredients[2]);

        cy.get('[data-testid=recipeProcedure-0]').type(fakeRecipe.procedure[0]);

        cy.get(':nth-child(8) > .text-muted > .ion').click();

        cy.get('[data-testid=recipeProcedure-1]').type(fakeRecipe.procedure[1]);

        cy.get(':nth-child(8) > .text-muted > .ion').click();

        cy.get('[data-testid=recipeProcedure-2]').type(fakeRecipe.procedure[2]);

        const dropEvent = {
            dataTransfer: {
                files: [
                ],
            },
        };
        
        cy.fixture(fakeRecipe.imageUrl).then((picture) => {
            return Cypress.Blob.base64StringToBlob(picture, 'image/jpeg').then((blob) => {
                dropEvent.dataTransfer.files.push(blob);
            });
        });
        
        cy.get('[data-testid=upload-image]').trigger('drop', dropEvent);

        cy.get('[data-testid=recipePublish]').click();


        /// Assertions

        // assert url has changed
        cy.url().should('contain', 'recipe');
        cy.contains(fakeRecipe.title).should('be.exist');
        cy.contains(fakeRecipe.description).should('be.exist');
        cy.contains(fakeRecipe.timeToCook).should('be.exist');
        cy.contains(fakeRecipe.ingredients[0]).should('be.exist');
        cy.contains(fakeRecipe.ingredients[1]).should('be.exist');
        cy.contains(fakeRecipe.ingredients[2]).should('be.exist');
        cy.contains(fakeRecipe.procedure[0]).should('be.exist');
        cy.contains(fakeRecipe.procedure[1]).should('be.exist');
        cy.contains(fakeRecipe.procedure[2]).should('be.exist');


        // assert we see recipe details

    });

});