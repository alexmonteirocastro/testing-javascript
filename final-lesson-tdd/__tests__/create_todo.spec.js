const { generateTodo } = require('../utils/generate');
const Todo = require('../src/database/models/Todo');
const server = require('../utils/setup');

describe('The todo creation process', () => {
    
    test('can create a todo', async () => {
        
        // fake some TODO data

        const TODO = generateTodo();

        // make a post request to server to create a todo
        const response = await server.post('/todos').send(TODO); 
        // console.log(response.body);


        /// assertions

        // assert the database has a new todo
        const todoFromDatabase = await Todo.find({ title: TODO.title });
        // console.log(todoFromDatabase);
        expect(todoFromDatabase[0].title).toBe(TODO.title);
        expect(todoFromDatabase[0].description).toBe(TODO.description);

    });

});