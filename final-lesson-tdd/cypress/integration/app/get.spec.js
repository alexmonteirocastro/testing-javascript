const { generateTodo } = require('../../../utils/generate');


describe('the get todo', () => {
    
    let todo;

    let createdTodo;

    beforeEach(() => {
        todo = generateTodo();

        // create a todo
        cy.request('POST', 'http://localhost:3001/api/todos', todo).then(response => {
            createdTodo = response.body; 
        });
    });

    it('should display a single todo from the database', () => {

        // redirect user to a single todo page
        cy.visit(`http://localhost:3001/todo/${createdTodo.id}`);

        // run assertions
        cy.contains(todo.title).should('exist');
        cy.contains(todo.description).should('exist');

    });

});