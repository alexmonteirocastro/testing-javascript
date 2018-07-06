const { generateTodo } = require('../../../utils/generate');

describe('the create todo process', () => {
    
    it('displays the form for creating a todo', () => {
        
        cy.visit('http://localhost:3001/todos/new');

    });

    it.only('creates a todo when a form is submitted ', () => {

        cy.visit('http://localhost:3001/todos/new');

        const todo = generateTodo();

        cy.get('h1').should('contain', 'Create a new todo.');
        
        cy.get('#title').type(todo.title);
        cy.get('#description').type(todo.description);

        cy.get('h1').should('contain', 'Create a new todo.');

        cy.get('button').should('contain', 'Create todo')
        cy.get('button').click();

        cy.url().should('not.contain', '/todos/new');

        cy.contains(todo.title).should('be.exist');
        cy.contains(todo.description).should('be.exist');
        
    });

});