const { generateRecipe, generateUser } = require('../../utils/generate');
const faker = require('faker');


describe('The recipe actions', () => {

    let recipeCreated;
    
    beforeEach(() => {
        
        /// arrange

        // setup first user, create recipe
        const user1 = generateUser();
        const recipe1 = generateRecipe();
        cy.request('POST', 'http://localhost:4080/api/v1/users/signup', user1).then(response => {
            cy.request('POST', 'http://localhost:4080/api/v1/recipes', {
                imageUrl: 'https://www.fortheloveofcooking.net/wp-content/uploads/2018/01/Pierogi-3626.jpg',
                title: recipe1.title,
                description: recipe1.description,
                timeToCook: recipe1.timeToCook,
                ingredients: JSON.stringify(recipe1.ingredients),
                procedure: JSON.stringify(recipe1.procedure),
                access_token: response.body.data.access_token
            }).then(recipeResponse => {
                recipeCreated = recipeResponse.body.data.recipe
            })
        })

        // setup second user
        const user2 = generateUser();
        cy.request('POST', 'http://localhost:4080/api/v1/users/signup', user2).then(response => {
            cy.window().then(window => {
                window.localStorage.setItem('authUser', JSON.stringify(response.body.data))
            })
        })
        
    });

    it('should favorite a recipe', () => {
        
        /// action

        // perform favourite action
        cy.visit(`http://localhost:4080/recipe/${recipeCreated.id}`);

        cy.get('.ion-ios-heart-outline').click();

        /// assertion

        // user sees notification
        // cy.contains('favorited').should('be.exist');

        // favourite count increased
        cy.get(':nth-child(3) > .ml-3').should('be.contain', '1');


    });

    it('should upvote a recipe', () => {
        
        /// action

        // perform favourite action
        cy.visit(`http://localhost:4080/recipe/${recipeCreated.id}`);

        cy.get('.ion-happy-outline').click();

        /// assertion

        // user sees notification
        // cy.contains('favorited').should('be.exist');

        // favourite count increased
        cy.get(':nth-child(1) > .ml-3').should('be.contain', '1');


    });

    it('should downvote a recipe', () => {
        
        /// action

        // perform favourite action
        cy.visit(`http://localhost:4080/recipe/${recipeCreated.id}`);

        cy.get('.ion-sad-outline').click();

        /// assertion

        // user sees notification
        // cy.contains('favorited').should('be.exist');

        // favourite count increased
        cy.get(':nth-child(2) > .ml-3').should('be.contain', '1');


    });

});