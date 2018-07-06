const Todo = require('../database/models/Todo');


module.exports = app => {

    app.get('/todo/:id', async (req, res) => {
        try {
            const todo = await Todo.findById(req.params.id);
            res.json(todo);   
        } catch (error) {
            return res.status(404).json({ message: 'Todo not found.' });
        }
    });

    app.post('/todos', async (req, res) => {
        const todo = await Todo.create(req.body);
        // console.log(todod);
        return res.json({
            message: 'TODO created successfully.'
        });
    });

};