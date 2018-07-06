const Todo = require('../src/database/models/Todo');
const server = require('../utils/setup');
const { generateTodo } = require('../utils/generate');


describe('get single todo', () => {
    
    test('can get single todo ', async () => {
        
        // create a fake todo
        const TODO = generateTodo();

        // persist fake todo to the database
        const createdTodo = await Todo.create(TODO);

        // fetch todo
        const response = await server.get(`/todo/${createdTodo.id}`);

        // assert the todo is returned
        expect(response.body).toEqual({
            title: TODO.title,
            id: createdTodo.id,
            description: TODO.description,
            completed: TODO.completed
        });

    });

    test('receives error message if todo was not found', async () => {
        
        /// arrange
        const id = 'FAKE_INVALID_ID';

        /// action

        // get invalid todo
        const response = await server.get(`/todo/${id}`);

        /// assertion 

        // assert the rerror message from server
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Todo not found.');


    });

});